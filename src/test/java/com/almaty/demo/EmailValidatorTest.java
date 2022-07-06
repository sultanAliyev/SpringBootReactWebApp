package com.almaty.demo;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class EmailValidatorTest {

    private final EmailValidator underTest = new EmailValidator();

    @Test
    public void itShouldValidateCorrectEmail(){
        assertThat(underTest.test("example@gmail.com")).isTrue();
    }

    @Test
    public void itShouldValidateAnInCorrectEmail(){
        assertThat(underTest.test("example.com")).isFalse();
    }

    @Test
    public void itShouldValidateAnInCorrectEmailWithoutDotAtTheEnd(){
        assertThat(underTest.test("example@gmail")).isFalse();
    }
}