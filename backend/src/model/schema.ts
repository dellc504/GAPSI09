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

// const parseIntSafe = (value: string): number | null => {
//   if (/^(\d+)$/.test(value)) {
//     return parseInt(value, 10);
//   }
//   return null;
// };

// const applyTakeConstraints = (params: { min: number; max: number; value: number }) => {
//   if (params.value < params.min || params.value > params.max) {
//     throw createGraphQLError(
//       `'take' argument value '${params.value}' is outside the valid range of '${params.min}' to '${params.max}'.`,
//     );
//   }
//   return params.value;
// };

// let   p = dao.getAllData()


// p.then(function (value) {
//   console.log(value); // Success!
// },
// function (reason) {
//   console.log(reason); // Error!
// },)


//console.log(dao.getAllData())


// [
//     {
//         id: 100,
//         nombre: "Google",
//         razonSocial: "Google Inc.",
//         direccion: "1600 Amphitheatre Parkway, Mountain View, CA 94043, EE. UU.",
//       },
//       {
//         id: 200,
//         nombre: "Microsoft",
//         razonSocial: "Microsoft Corporation",
//         direccion: "One Microsoft Way, Redmond, WA 98052, EE. UU.",
//       },
// ]

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
        id:21,
        nombre:args.nombre,
        razonSocial:args.razonSocial,
        direccion:args.direccion
      }
      dao.getAllData().then( (suppliers) =>{ 
        var  supx = suppliers.find((sup) => sup.nombre === args.nombre)
        console.log(supx)
        if(supx === undefined){ 
          console.log('Intento  de registro ')
          suppliers.push(supplier)
          dao.savetData(suppliers)
        }
        else{
          supplier ={
            id:-1,
            nombre:"",
            razonSocial:"",
            direccion:""
          }
        }
      })
      return supplier
    },
    editarProveedor:(parent:Proveedor , args:{id:number, nombre: string, razonSocial: string, direccion: string}) =>{
      const  supplier ={
        id:21,
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
      var resp= "F"
      dao.delete(args.id).then(()=>{
        console.log('delete OK')
        resp = "OK"
      })

      return resp
      
    }
    

    
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});