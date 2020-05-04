package com.bobrothers.typefast4;

import javax.persistence.*;

@Entity
@Table(name = "sentences")
public class Sentences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String sentence;

    public Integer getId() {
        return id;
    }

    public String getSentence() {
        return sentence;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setSentence(String sentence) {
        this.sentence = sentence;
    }
}
