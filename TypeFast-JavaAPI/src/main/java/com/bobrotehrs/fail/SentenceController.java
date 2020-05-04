//package com.bobrothers.typefast4;
//
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.concurrent.atomic.AtomicInteger;
//import java.util.concurrent.atomic.AtomicLong;
//
//@RestController
//public class SentenceController {
//    private static String sentence;
//
//    @CrossOrigin(origins = "*")
//    @GetMapping("/sentence")
//    public String getSentence(@RequestParam(value="sentence", defaultValue = "What do you want?") String name) {
//        AtomicInteger val = new AtomicInteger(1);
//        int id = val.getAndIncrement();
//
//        SentencesRepository repository;
//        return sentence; // read sentence from DB and return it here
//    }
//}
