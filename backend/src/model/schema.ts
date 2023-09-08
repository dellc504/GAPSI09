import { createGraphQLError } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { Proveedor } from './types';
import { DAO } from './dao';
const typeDefinitions = /* GraphQL */ `
  

  type Proveedor {
    id: ID!
    nombre: String!
    razonSocial: String!
    direccion: String!
  }

  type Query {
    hello: String!
    version: String!,
    Proveedores: [Proveedor!]!
  }

  type Mutation {
    nuevoProveedor(nombre: String!, razonSocial: String!, direccion: String!): Proveedor!
    editarProveedor(id: ID!,nombre: String!, razonSocial: String!, direccion: String!): Proveedor!
    eliminarProveedor(id:ID!): String!

  }
`;

const dao = new DAO("db.json");

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
    version: ()=> '0.2.1',
    Proveedores: ()=> dao.getAllData()
    
  },
  Proveedor: {
    id: (parent: Proveedor) => parent.id,
    nombre: (parent:  Proveedor) => parent.nombre,
    razonSocial: (parent:  Proveedor) => parent.razonSocial,
    direccion: (parent:  Proveedor) => parent.direccion
  },

  Mutation: {
    nuevoProveedor: (parent:Proveedor , args:{nombre: string, razonSocial: string, direccion: string}) =>{
      var  supplier ={
        id: Math.floor(Math.random()*990) + 10,
        nombre:args.nombre,
        razonSocial:args.razonSocial,
        direccion:args.direccion
      }
      return dao.getAllData().then( (suppliers) =>{ 
        var  supx = suppliers.find((sup) => sup.nombre === args.nombre)
        console.log(supx)
        if(supx === undefined){
          suppliers.push(supplier)
          dao.savetData(suppliers)
          return supplier
        }else{
          console.log('repetido')
          return {
            id:-1,
            nombre:"",
            razonSocial:"",
            direccion:""
          }
        }
      })
    },
    editarProveedor:(parent:Proveedor , args:{id:number, nombre: string, razonSocial: string, direccion: string}) =>{
      const  supplier ={
        id:args.id,
        nombre:args.nombre,
        razonSocial:args.razonSocial,
        direccion:args.direccion
      }
      dao.edit(args.id, supplier).then( (s)=>{
        console.log('update OK')
      })
      return supplier
    },
     eliminarProveedor:(parent:Proveedor , args:{id:number})=>{
      return dao.delete(+args.id).then(()=>{
        console.log('delete OK')
        return "OK"
      }).catch(error => {
        console.log('error in delete', error);
        return "F"
      });
    }
    

    
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});