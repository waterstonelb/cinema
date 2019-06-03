package com.example.cinema.blImpl.sales;

import com.example.cinema.bl.management.ScheduleService;
import com.example.cinema.bl.promotion.ActivityService;
import com.example.cinema.bl.promotion.CouponService;
import com.example.cinema.bl.promotion.VIPService;
import com.example.cinema.bl.sales.TicketService;
import com.example.cinema.blImpl.management.hall.HallServiceForBl;
import com.example.cinema.blImpl.management.schedule.ScheduleServiceForBl;
import com.example.cinema.blImpl.promotion.ActivityServiceForBl;
import com.example.cinema.blImpl.promotion.CouponServiceForBl;
import com.example.cinema.data.promotion.CouponMapper;
import com.example.cinema.data.sales.TicketMapper;
import com.example.cinema.po.*;
import com.example.cinema.vo.*;

import org.apache.ibatis.javassist.expr.NewArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by liying on 2019/4/16.
 */
@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    ScheduleServiceForBl scheduleService;
    @Autowired
    HallServiceForBl hallService;
    @Autowired
    CouponService couponService;
    @Autowired
    CouponServiceForBl couponServiceForBl;
    @Autowired
    VIPService vipService;
    @Autowired
    ActivityServiceForBl activityServiceForBl;
    @Transactional
    public ResponseVO addTicket(TicketForm ticketForm) {
        try {
            List<Ticket> ticketList = new ArrayList<>();
            for (int i = 0; i < ticketForm.getSeats().size(); i++) {
                Ticket ticket = new Ticket(ticketForm.getUserId(), ticketForm.getScheduleId(),
                        ticketForm.getSeats().get(i).getColumnIndex(), ticketForm.getSeats().get(i).getRowIndex(), 0);
                ticketList.add(ticket);
            }
            ticketMapper.insertTickets(ticketList);
            //获取coupon数据
            @SuppressWarnings("unchecked")
            List<Coupon> coupons = (List<Coupon>) couponService.getCouponsByUser(ticketForm.getUserId()).getContent();//获取activity数据
            //获取totals数据
            ScheduleItem scheduleItem = scheduleService.getScheduleItemById(ticketForm.getScheduleId());
            double totals = scheduleItem.getFare() * ticketForm.getSeats().size();
            List<TicketVO> ticketVOList = new ArrayList<TicketVO>();
            for (int i = 0; i < ticketForm.getSeats().size(); i++) {
                Ticket nticket = ticketMapper.selectTicketByScheduleIdAndSeat(ticketForm.getScheduleId(), ticketForm.getSeats().get(i).getColumnIndex(), ticketForm.getSeats().get(i).getRowIndex());
                ticketVOList.add(nticket.getVO());
            }

            TicketWithCouponVO twc = new TicketWithCouponVO();
            twc.setActivities(null);
            twc.setCoupons(coupons);
            twc.setTicketVOList(ticketVOList);
            twc.setTotal(totals);
            return ResponseVO.buildSuccess(twc);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    @Transactional
    public ResponseVO completeTicket(TicketBuyForm ticketBuyForm) {//校验优惠券和根据优惠活动赠送优惠券
        try {
            for (Integer ticketId : ticketBuyForm.getTicketId()) {
                ticketMapper.updateTicketState(ticketId, 1);
            }
            double total=useCoupon(ticketBuyForm.getTicketId().get(0),ticketBuyForm.getCouponId(),ticketBuyForm.getTicketId().size());//扣款金额，暂不处理
            int numOfCoupon=userGetCoupons(ticketBuyForm.getTicketId().get(0));
            return ResponseVO.buildSuccess(numOfCoupon);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseVO.buildFailure("购票失败！");
        }
    }

    @Override
    public ResponseVO getBySchedule(int scheduleId) {
        try {
            List<Ticket> tickets = ticketMapper.selectTicketsBySchedule(scheduleId);
            ScheduleItem schedule = scheduleService.getScheduleItemById(scheduleId);
            Hall hall = hallService.getHallById(schedule.getHallId());
            int[][] seats = new int[hall.getRow()][hall.getColumn()];
            tickets.stream().forEach(ticket ->
                seats[ticket.getRowIndex()][ticket.getColumnIndex()] = 1
            );
            ScheduleWithSeatVO scheduleWithSeatVO = new ScheduleWithSeatVO();
            scheduleWithSeatVO.setScheduleItem(schedule);
            scheduleWithSeatVO.setSeats(seats);
            return ResponseVO.buildSuccess(scheduleWithSeatVO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO getTicketByUser(int userId) {
        try {
            List<TicketWithScheduleVO> ticketWithScheduleVOS = new ArrayList<>();
            for (Ticket ticket : ticketMapper.selectTicketByUser(userId)) {
                if (ticket.getState() == 1 || ticket.getState() == 2) {
                    TicketWithScheduleVO ticketWithScheduleVO=new TicketWithScheduleVO();
                    ticketWithScheduleVO.setId(ticket.getId());
                    ticketWithScheduleVO.setUserId(ticket.getUserId());
                    ticketWithScheduleVO.setSchedule(scheduleService.getScheduleItemById(ticket.getScheduleId()));
                    ticketWithScheduleVO.setColumnIndex(ticket.getColumnIndex());
                    ticketWithScheduleVO.setRowIndex(ticket.getRowIndex());
                    ticketWithScheduleVO.setState(ticket.getState()==1?"已完成":"已失效");
                    ticketWithScheduleVO.setTime(ticket.getTime());

                    ticketWithScheduleVOS.add(ticketWithScheduleVO);
                }
            }
            return ResponseVO.buildSuccess(ticketWithScheduleVOS);
        } catch (Exception e) {
            return ResponseVO.buildFailure("用户查询已购票失败！");
        }
    }

    @Override
    @Transactional
    public ResponseVO completeByVIPCard(TicketVIPBuyForm ticketVIPBuyForm) {
        try{
            for (Integer ticketId : ticketVIPBuyForm.getTicketId()) {
                ticketMapper.updateTicketState(ticketId, 1);
            }
            double total=useCoupon(ticketVIPBuyForm.getTicketId().get(0),ticketVIPBuyForm.getCouponId(),ticketVIPBuyForm.getTicketId().size());//扣款金额，暂不处理
            VIPCard vipCard=(VIPCard) vipService.buyTicket(ticketVIPBuyForm.getUserId(),total).getContent();
            userGetCoupons(ticketVIPBuyForm.getTicketId().get(0));
            return ResponseVO.buildSuccess(vipCard);
        }catch (Exception e){
            return ResponseVO.buildFailure("vip购票失败");
        }
    }

    @Override
    public ResponseVO cancelTicket(List<Integer> id) {
        try {
            for (int Id : id) {
                ticketMapper.updateTicketState(Id,2);
            }
            return ResponseVO.buildSuccess();
        }catch (Exception e){
            return ResponseVO.buildFailure("退票失败");
        }
    }

    private int userGetCoupons(int ticketId ){
        Ticket ticket=ticketMapper.selectTicketById(ticketId);
        int scheduleId=ticket.getScheduleId();
        int movieId=scheduleService.getScheduleItemById(scheduleId).getMovieId();
        List<Activity> activities=activityServiceForBl.getActivitiesByMovie(movieId);
        for (Activity avtivity:activities) {
            couponService.issueCoupon(avtivity.getCoupon().getId(),ticket.getUserId());
        }
        return activities.size();
    }

    /**
     *
     * @param ticketId
     * @param couponId
     * @return 使用优惠券后总金额
     */
    private double useCoupon(int ticketId,int couponId,int numOfTicket){
        try {
            Ticket ticket = ticketMapper.selectTicketById(ticketId);
            double oneMoive = scheduleService.getScheduleItemById(ticket.getScheduleId()).getFare();
            boolean isDelete = couponServiceForBl.deleteUserCoupon(ticket.getUserId(), couponId);
            double total = isDelete?oneMoive * numOfTicket - couponServiceForBl.getCoupon(couponId).getDiscountAmount():oneMoive * numOfTicket;
            return total;
        }catch (Exception e){
            return 0;
        }
    }
}
