package com.example.cinema.vo;

import java.util.List;

public class TicketVIPBuyFrom {

    private List<Integer> ticketId;
    private int couponId;
    private double totals;
    private int userId;

    public List<Integer> getTicketId() {
        return ticketId;
    }

    public int getCouponId() {
        return couponId;
    }

    public double getTotals() {
        return totals;
    }

    public int getUserId() {
        return userId;
    }
}
