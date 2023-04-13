package com.example.demo.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository underTest;

    @AfterEach
    void tearDown() {
        // delete all data after tests finished
        underTest.deleteAll();
    }

    @Test
    void itShouldCheckWhenStudentEmailExists() {
        // given
        String email = "aboubacar@gmail.com";
        Student student = new Student(
                 "Aboubacar",
                email,
                 Gender.MALE);
         underTest.save(student);
        // when
        boolean expected = underTest.selectExistsEmail(email);
        // then
        assertThat(expected).isTrue();
    }

    @Test
    void itShouldCheckWhenStudentEmailDoesNotExist() {
        // given
        String email = "aboubacar@gmail.com";
        // when
        boolean expected = underTest.selectExistsEmail(email);
        // then
        assertThat(expected).isFalse();
    }
}