package com.example.cinema.po;




/**
 * Created by liying on 2019/3/23.
 */
public class MovieLikePO {
    /**
     * 喜爱人数
     */
    private int likeNum;
    /*
     * 电影名称
     */
    private String moviename;
    
    
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