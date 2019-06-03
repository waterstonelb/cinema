package com.example.cinema.blImpl.promotion;

import com.example.cinema.po.Coupon;

public interface CouponServiceForBl {
    /**
     *
     * @param userId
     * @param couponId
     * @return  是否删除成功
     */
    boolean deleteUserCoupon(int userId,int couponId);

    /**
     *
     * @param couponId
     * @return 对应Id的优惠券
     */
    Coupon getCoupon(int couponId);
}
