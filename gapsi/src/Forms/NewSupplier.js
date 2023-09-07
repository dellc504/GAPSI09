import { gql, useMutation } from "@apollo/client";
import {
    Input,
    Form,
    Modal,
    Upload,
    Button
} from "antd";
import { UserAddOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

const CREATE_CUSTOMER = gql`mutation createSupplier($nombre: String!, $razonSocial: String!, $direccion: String!){
    nuevoProveedor(nombre:$nombre, razonSocial:$razonSocial, direccion:$direccion, ){id}}`;
    

function NewSupplier(callback) {
    const [addSupplier] = useMutation(CREATE_CUSTOMER, {
        onCompleted(data) {
            if(data.nuevoProveedor.id==-1){
                callback('d')
            }else{
                callback('ok')
            } 

        },
        onError(err) {
            console.log(err)
            callback('err')
        }
    });
    const [form] = Form.useForm();
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e.fileList;
      };


    const onFinish = (values) => {
       
        addSupplier({ variables: values })
        form.resetFields()
    }

    const fviewModal = useCallback(() => {

        Modal.confirm({
            title: 'Crear nuevo proveedor ',
            centered: true,
            okText: 'Crear',

            // width: 600,
            cancelText: 'Cancelar',
            icon: <UserAddOutlined />,
            cancelButtonProps: {
                danger: true,
            },
            content: (<>
                <Form
                    form={form}
                    name="userForm"
                    onFinish={onFinish}
                    // labelCol={{
                    //     span: 8,
                    // }}
                    // wrapperCol={{
                    //     span: 16,
                    // }}
                >
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
                    <Form.Item label="razon Social" name="razonSocial"
                        rules={[
                            {
                                required: true,
                                message: 'La rezon social es requerido.',
                            },
                        ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Dirección" name="direccion"
                        rules={[
                            {
                                required: true,
                                message: 'La dirección  es requerida',
                            },
                        ]}>
                        <Input />
                    </Form.Item>

                </Form>
            </>


            ),
            onOk: () => {
                //e.preventDefault();
                form.submit()
                //addUser({ variables: { fullname: 'new' } });
                //input.value = '';

            },
            onCancel: ()=>{
                form.resetFields()
            }
        });
    });

    return fviewModal
}

export default NewSupplier