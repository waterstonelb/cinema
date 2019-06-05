package com.example.cinema.bl.promotion;

import com.example.cinema.vo.ResponseVO;

public interface VIPActivityService{
    /**
     * 查找所有的vip卡
     * @return List<vip_activity>
     */
    ResponseVO getCards();
}