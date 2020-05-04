package com.bobrothers.typefast4;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/getSentencesDB")
public class SqlController {
    @Autowired
    private SentencesRepository sentencesRepository;
    @Autowired
    private SuggestionsRepository suggestionsRepository;

    @PostMapping(path="/add")
    public @ResponseBody String addNewSentence (@RequestBody String sentence) {
        Suggestions n = new Suggestions();
        n.setNewSentence(sentence);
        suggestionsRepository.save(n);
        return "Sentence saved succesfully.";
    }

    @GetMapping(path="/getSentence")
    public @ResponseBody String getRandomSentence() {
        Long count = sentencesRepository.getSentenceCount();
        Long pickedNumber = Math.round(Math.random()*count);
        int nr = pickedNumber.intValue();
        return sentencesRepository.findById(nr).orElse(new Sentences()).getSentence();

    }
}
