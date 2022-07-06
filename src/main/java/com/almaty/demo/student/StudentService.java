package com.almaty.demo.student;

import com.almaty.demo.EmailValidator;
import com.almaty.demo.exception.ApiRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentDataAccessService studentDataAccessService;
    private final EmailValidator emailValidator;

    @Autowired
    public StudentService(StudentDataAccessService studentDataAccessService,
                          EmailValidator emailValidator) {
        this.studentDataAccessService = studentDataAccessService;
        this.emailValidator = emailValidator;
    }

    public List<Student> getAllStudents(){
        return studentDataAccessService.selectAllStudents();
    }

    public void editStudent(UUID studentId) {
         studentDataAccessService.editStudent(studentId);
    }

    public void addNewStudent(Student student) {
        addNewStudent(null, student);
    }

    public void addNewStudent(UUID StudentId, Student student) {
      UUID newStudentId = Optional.ofNullable(StudentId).orElse(UUID.randomUUID());

      if(!emailValidator.test(student.getEmail())){
          throw new ApiRequestException(student.getEmail() + " is not valid");
      }

      if(studentDataAccessService.isEmailTaken(student.getEmail())){
          throw new ApiRequestException(student.getEmail() + " is already taken");
      }

        studentDataAccessService.insertStudent(newStudentId, student);
    }

    public List<StudentCourse> getAllCoursesForStudent(UUID studentId) {
        return studentDataAccessService.selectAllCoursesforStudent(studentId);
    }
}
