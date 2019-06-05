package com.example.cinema.controller.promotion;

import com.example.cinema.bl.promotion.VIPActivityService;
import com.example.cinema.vo.VIPCardForm;
import com.example.cinema.vo.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * create by 梁斌
 */
@RestController()
@RequestMapping("/vipactivity")

public class VIPActivityController{
    @Autowired 
    VIPActivityService vipActivityService
}