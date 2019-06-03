package com.example.cinema.blImpl.promotion;

import java.util.*;
import com.example.cinema.bl.promotion.ActivityService;
import com.example.cinema.bl.promotion.CouponService;
import com.example.cinema.data.promotion.ActivityMapper;
import com.example.cinema.po.Activity;
import com.example.cinema.po.Coupon;
import com.example.cinema.vo.ActivityForm;
import com.example.cinema.vo.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by 梁斌 on 2019/5/27.
 */
public interface ActivityServiceForBl {
    /**
     * 根据movie查找相对应所有的activity
     * @param movieId
     * @return activities
     */
    List<Activity> getActivitiesByMovie(int movieId);
}
