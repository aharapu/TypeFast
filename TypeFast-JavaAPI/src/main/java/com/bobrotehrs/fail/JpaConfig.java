//package com.bobrothers.typefast4;
//
//import org.springframework.boot.jdbc.DataSourceBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//
//import javax.sql.DataSource;
//
//@Configuration
//public class JpaConfig {
//
//    @Bean(name = "mySqlDataSource")
//    @Primary
//    public DataSource mySqlDataSource() {
//        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
//        dataSourceBuilder.url("jdbc:mysql://localhost/");
//        dataSourceBuilder.username("root");
//        dataSourceBuilder.password("root");
//        return dataSourceBuilder.build();
//    }
//}
