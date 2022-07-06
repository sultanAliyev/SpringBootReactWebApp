import './App.css';
import React, { Component } from 'react';
import { getAllStudents } from "./client";
import Footer from './Footer';
import {Table, Avatar, Spin, Modal, Empty, Button, Popconfirm } from 'antd';
import AddStudentForm from './forms/AddStudentForm';
import {errorNotification} from './Notification';
import Container from './Container';

class App extends Component {

  state = {
    students: [],
    isFetching: false,
    isAddStudentModalVisible: false,
    isEditStudentModalVisible: false
  }

  componentDidMount () {
    this.fetchAllStudents();
  }

  openAddStudentModal = () => this.setState({isAddStudentModalVisible: true});
  openEditStudentModal = () => this.setState({isEditStudentModalVisible: true});

  closeAddStudentModal = () => this.setState({isAddStudentModalVisible: false});
  closeEditStudentModal = () => this.setState({isEditStudentModalVisible: false});

  fetchAllStudents = () => {
        this.setState({
          isFetching: true
        });
      getAllStudents().then(respon => respon.json().then(students => {
        console.log(students);
        this.setState({
          students,
          isFetching: false
        });
      }))
      .catch(error => {
        console.log(error.error);
        const message = error.error.message;
        const description = error.error.error;
        errorNotification(message,description);
        this.setState({
          isFetching: false
        });
      });
  }

  render() {

    const { students, isFetching, isAddStudentModalVisible,isEditStudentModalVisible, openEditStudentModal } = this.state;

    const commonElements = () => (
      <div>
        <Modal
          title='Add new student'
          visible={isAddStudentModalVisible}
          onOk={this.closeAddStudentModal}
          onCancel={this.closeAddStudentModal}
          width={1000}>
            <h1>Hello Modal with Antd</h1>

            <AddStudentForm
            onSuccess={() => {
              this.closeAddStudentModal();
              this.fetchAllStudents();
            }}
            onFailure={(error) => {
              const message = error.error.message;
              const description = error.error.httpStatus;
              errorNotification(message, description);
            }}/>

          </Modal>

          <Modal
          title='Edit'
          visible={isEditStudentModalVisible}
          onOk={this.closeEditStudentModal}
          onCancel={this.closeEditStudentModal}
          width={1000}>

            <AddStudentForm
            onSuccess={() => {
              this.closeEditStudentModal();
            }}
            onFailure={(error) => {
              const message = error.error.message;
              const description = error.error.httpStatus;
              errorNotification(message, description);
            }}/>
            
          </Modal>

          <Footer 
          numberOfStudents={students.length}
          handleAddStudentClickEvent={this.openAddStudentModal}/>
      </div>
    )

    if (isFetching){
      return (
        <Container>
          <Spin tip="Loading..."/>
        </Container>
      );
    }

    if(students && students.length){

    const columns = [
      {
        title: '',
        key:'avatar',
        render: (text, student) => (
          <Avatar size='large'>
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
          </Avatar>
        )
      },
      {
        title: 'Student Id',
        dataIndex: 'studentId',
        key: 'studentId'
      },
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName'
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, student) => (
          <div>
          <Button type="primary"
           style={{margin: '0 10px'}}
           onClick={() => openEditStudentModal}>
            Edit
          </Button>

          <Button danger>
            Delete
          </Button>
          </div>
        )
      }
    ];

    return ( 
      <Container>
         <Table 
            style={{marginBottom: '100px'}}
            dataSource={students} 
            columns={columns} 
            pagination={false}
            rowKey='studentId' />
            {commonElements()}
      </Container>
            );

    }

    return (
      <Container>
        <Empty description={
          <h1>No Student found</h1>
        }/>
        {commonElements()}
      </Container>
    )
  }
}

export default App;
