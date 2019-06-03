package com.example.cinema.vo;

import com.example.cinema.po.PopularMovies;

/**
 * @author fjj
 * @date 2019/4/21 1:42 PM
 */
public class PopularMoviesVO {
    private Integer movieId;
    /**
     * 票房(单位：元)，(PS:如果后续数据量大，可自行处理单位，如改成单位：万元)
     */
    private Integer boxOffice;
    private String name;

    public PopularMoviesVO(PopularMovies popularMovies){
        this.movieId = popularMovies.getMovieId();
        this.boxOffice = popularMovies.getBoxOffice();
        this.name = popularMovies.getName();
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getBoxOffice() {
        return boxOffice;
    }

    public void setBoxOffice(Integer boxOffice) {
        this.boxOffice = boxOffice;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
