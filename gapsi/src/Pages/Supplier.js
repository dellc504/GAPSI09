
import {
    Row,
    Col,
    Card,
    Space,
    Table,
    Button,
    Input,
    Form,
    Modal,
    Result,
    Spin,
    message,
    Popconfirm,
} from "antd";

import React, { useState } from 'react';
import { EditOutlined, UserAddOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import newUser2 from '../Forms/NewSupplier'
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";


const ALL_SUPPLIERS = gql`query{Proveedores{id,nombre,razonSocial,direccion}}`;
const DELETE_SUPPLIER = gql`mutation delete($id:ID!){eliminarProveedor(id:$id)}`;
const UPDATE_CUSTOMER = gql`mutation UpdateCustomer($id:String!, $name:String!, $domine:String, $logo:String, $key:String!, $bussines: String!){
    updateCustomer(id:$id,name:$name, domine:$domine, logo:$logo, key:$key, idBussines: $bussines){customer{id}}}`;


function Supplier() {

    const { error, loading, data, refetch } = useQuery(ALL_SUPPLIERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [logoCustomer, setLogoCustomer] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const rol = localStorage.getItem('kyrl')
    const flagGlobal  = (rol==2  || rol==4)? true: false
    const createCustomer = newUser2((resp) => {
        
        
        if(resp =='ok'){
            refetch().then(
                (rs) => {
                    messageApi.open({
                        type: 'success',
                        content: 'Proveedor creado correctamente! ',
                    });
                },
                (err) => { console.log(err) }
                // logic goes here ..
            );
        }else {
            messageApi.open({
                type: 'error',
                content: 'Proveedor ya se encuentra registrado! ',
            });
        }
        
    });
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e.fileList;
      };

    const [updateSupplier] = useMutation(UPDATE_CUSTOMER, {
        onCompleted(data) {

            console.log('Ok se agrego correctamente')
            messageApi.open({
                type: 'success',
                content: 'Empresa actualizada correctamente! ',
            });
            setConfirmLoading(false);
            setIsModalOpen(false)
            form.resetFields()
            setLogoCustomer('')

        },
        onError(err) {
            console.log(err)

        },
        refetchQueries: [{ query: ALL_SUPPLIERS, fetchPolicy:"network-only", awaitRefetchQueries: true }]
    }
    );


    const [deleteSupplier] = useMutation(DELETE_SUPPLIER, {
        onCompleted(data) {
            console.log('Ok se agrego correctamente')
            setIsModalOpen(false)
            setConfirmLoading(false)
            messageApi.open({
                type: 'success',
                content: 'Proveedor eliminado correctamente! ',
            });


        },
        onError(err) {
            console.log(err)
        },
        refetchQueries: [{ query: ALL_SUPPLIERS,  awaitRefetchQueries: true }]
    }
    );



    const onFinish = (values) => {
        setConfirmLoading(true);
        console.log(values)
        updateSupplier({ variables: values })
    };


    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters, confirm) => {
        console.log('Reset  fields')
        clearFilters();
        confirm();
        setSearchedColumn('');
        setSearchText('');

      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Buscar ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="middle"
              style={{ width: 90, marginRight: 8 }}
            >
              Buscar
            </Button>
            <Button onClick={() => handleReset(clearFilters, confirm)} size="middle" style={{ width: 90 }}>
              Restablecer
            </Button>
          </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
          // setTimeout(() =>  , 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <span style={{ fontWeight: 'bold' }}>{text}</span>
          ) : (
            <span>{text}</span>
          ),
      });



      const deleteWRow = () => {
        setConfirmLoading(true)
        deleteSupplier({ variables: { id: +form.getFieldValue('id') } })
    }


    if (error) {
        return <><Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}> <Result
            status="warning"
            title="Error al cargar informacion. (verifique conexion  con el backend IP )"
            extra={
                <Button type="primary" key="console">
                    Reintentar
                </Button>
            }
        /></Space></>
    }

    if (loading) {
        return <><Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }} ><Spin size="large" /></Space></>
    }








    const columns =  [
        {
            title: "EMPRESA",
            dataIndex: "nombre",
            key: "nombre",
            ...getColumnSearchProps('nombre')
        },
        {
            title: "RAZÓN SOCIAL",
            dataIndex: "razonSocial",
            key: "razonSocial",
            ...getColumnSearchProps('domine')
        },
        {
            title: "DIRECCIÓN",
            key: "direccion",
            dataIndex: "direccion",
            ...getColumnSearchProps('direccion')
        },
        {
            title: "EDITAR REGISTRO",
            dataIndex: 'id',
            key: 'id',
            render: (index, record) => (
                <>
                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                        <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    </Space>
                    {/* <Button type="primary" shape="circle" icon={<EditOutlined />} /> */}
                </>
            )
        }
    ];

    const showModal = (record) => {
        form.setFieldsValue({
            id: record.id,
            nombre: record.nombre,
            razonSocial: record.razonSocial,
            direccion: record.direccion

        })
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
        setLogoCustomer('')

    };

    var cnt = 1
    var xv = data.Proveedores.map(e => {
        return {
            key: cnt++,
            keyx: e.key,
            id: e.id,
            nombre: e.nombre,
            razonSocial: e.razonSocial,
            direccion: e.direccion,
            edit: (
                <>
                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                        <Button icon={<EditOutlined />} onClick={showModal} />
                    </Space>
                    {/* <Button type="primary" shape="circle" icon={<EditOutlined />} /> */}
                </>
            )
        };
    });

    return (
        <>
            {contextHolder}
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Proveedores"
                            extra={
                                <>
                                    <Button type="primary" icon={<UserAddOutlined />} onClick={createCustomer} />
                                    {/* onClick={createCustomer} */}
                                </>
                            }
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={xv}
                                    scroll={{ x: 400 }}
                                    pagination={false}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <ul>
            </ul>
            {/*  Form create user  */}
            <Modal title="Empresa" open={isModalOpen}   onOk={() => form.submit()} 
                onCancel={handleCancel} style={{ top: 20 }}   confirmLoading={confirmLoading}  footer=" "  >
                <Form
                    form={form}
                    name="customerForm"
                    onFinish={onFinish}
                   
                 
              
                >

                    <Form.Item name="id" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        label="Nombre de la empresa"
                        name="nombre"
                        rules={[
                            {
                                required: true,
                                message: 'El nombre es requerido.',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Razon social" name="razonSocial"
                        rules={[
                            {
                                required: true,
                                message: 'Es requerido',
                            },
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="direccion" name="direccion"
                        rules={[
                            {
                                required: true,
                                message: 'La direccion es requerida',
                            },
                        ]}>
                        <Input />
                    </Form.Item>

                    <Row>   <Col span={12} offset={6}>
                        <Popconfirm
                            title="Eliminar Proveedor"
                            description="Confirma si deseas eliminar este proveedor"
                            onConfirm={deleteWRow}
                            onCancel={() => setIsModalOpen(false)}
                            okButtonProps={{ size: "middle", loading: confirmLoading }}
                            cancelButtonProps={{ size: "middle" }}
                            okText="Si"
                            cancelText="No"
                        >
                            <Button danger>Eliminar</Button>
                        </Popconfirm>
                    </Col>
                        <Col span={2} offset={2}>
                            <Button htmlType="submit" type="primary">Actualizar</Button>

                        </Col>
                    </Row>
                </Form>



            </Modal>

        </>
    );



}








export default Supplier;
