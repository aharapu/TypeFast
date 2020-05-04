package com.bobrothers.typefast4;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface SentencesRepository extends CrudRepository<Sentences, Integer> {

    @Query("select count(*) from Sentences")
    public Long getSentenceCount();
}
