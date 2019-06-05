package com.example.cinema.vo;

import com.example.cinema.po.MovieLikePO;

import java.sql.Date;

/**
 * @author fjj
 * @date 2019/4/28 6:03 PM
 */
public class MovieLikeVO {
    /**
     * 喜爱人数
     */
    private int likeNum;
    
    /**
     * 电影名称
     */
    private String moviename;

    public MovieLikeVO(MovieLikePO movielike){
        this.likeNum = movielike.getLikeNum();
        this.moviename = movielike.getmoviename();
    }

    public int getLikeNum() {
        return likeNum;
    }

    public void setLikeNum(int likeNum) {
        this.likeNum = likeNum;
    }


    public String getmoviename() {
        return moviename;
    }

    public void setmoviename(String moviename) {
        this.moviename = moviename;
    }
}
