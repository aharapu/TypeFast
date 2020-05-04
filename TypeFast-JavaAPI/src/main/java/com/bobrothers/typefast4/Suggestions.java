package com.bobrothers.typefast4;

import javax.persistence.*;

@Entity
@Table(name = "suggestions")
public class Suggestions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggestion_id")
    private Integer id;
    @Column(name = "new_sentence")
    private String newSentence;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNewSentence() {
        return newSentence;
    }

    public void setNewSentence(String newSentence) {
        this.newSentence = newSentence;
    }
}
