
import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Axios from "axios";
import {
  Layout,
  message,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Image,
  Space,

} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import banner from "../assets/images/banner1.png";
import logo from "../assets/images/logo.png";


function onChange(checked) {
  console.log(`switch to ${checked}`);
}
const { Title } = Typography;
const { Header, Content } = Layout;

const LOGO = gql`query Customer($domine: String!){customers(domine:$domine){logo, key}}`;

const LOGIN = gql`
query LogIn($username: String!, $password: String!, $key:String!){
  loginUser(username:$username, password: $password, key:$key){
    username, rol
  }
}`;

function SignIn() {
  const routeParams = useParams();
  const  [version, setVersion] = useState("")
  const  [msg, setMsg] = useState("")

  const [form] = Form.useForm();
  const navigate = useNavigate();
  

  const [messageApi, contextHolder] = message.useMessage();
  const [loadingS, setLoading] = useState(false);




  useEffect(() => {
    Axios({
      method:'post',
      url: "http://localhost:4000/version",
    })
      .then((response) => {
        setVersion(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });


      Axios({
        method:'post',
        url: "http://localhost:4000/msg",
      })
        .then((response) => {
          setMsg(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });



  });


  const onFinish = (values) => {

    navigate("/proveedor");


  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <>
      {contextHolder}
      <Layout className="layout-default layout-signin">
        <Header>
          <div className="header-col header-brand">
            <h5> e-Commerce Gapsi</h5>
          </div>
          <div className="header-col header-btn">
          </div>
        </Header>
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around" >
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }} >
                <Image preview={false} src={logo} />
              </Space>


              <Title className="font-regular text-muted" level={5}>
                {msg}
              </Title>
              
                <Form
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  layout="vertical"
                  className="row-col"
                  form={form}
                >

            

             
         
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%" }}
                    >
                      Continuar
                    </Button>
                  </Form.Item>
                </Form>
             

             {version}
            </Col>
         
          </Row>
        </Content>

      </Layout>
    </>
  );
}


export default SignIn