const fs = require('fs');
const dataPath = 'db.json' 


export class DAO {

    constructor(private readonly path: string = dataPath) {}

    async create(data: {
      nombre: string;
      direccion: string;
      razonSocial: string;
    }) {
      const json = JSON.stringify(data);
      await fs.writeFileSync(this.path, json);
    }
  
    async edit(id: number, data: {
      nombre: string;
      direccion: string;
      razonSocial: string;
    }) {
      const items = await this.read();
      const item = items.find((item) => item.id === id);
      if (item) {
        item.nombre = data.nombre;
        item.direccion = data.direccion;
        item.razonSocial = data.razonSocial;
        const json = JSON.stringify(items);
        await fs.writeFileSync(this.path, json);
      }
    }
  
    async delete(id: number) {
      const items = await this.read();
      const itemsNew = items.filter((item) => item.id !== id);
      const json = JSON.stringify(itemsNew);
      await fs.writeFileSync(this.path, json);
    }
  
    async read() {
      const json = await fs.readFileSync(this.path);
      const items = JSON.parse(json);
      return items;
    }

    async savetData(data)  {
        fs.writeFileSync(dataPath, JSON.stringify(data))
    }
    
    async getData () {
        return await JSON.parse(fs.readFileSync(dataPath))    
    }


    async getAllData(){
        //var suppliers : Array<Proveedor>  =  []
        const data =  await  this.getData();
        return data.map((item) => ({
          id:  item.id,
          nombre: item.nombre,
          razonSocial: item.razonSocial,
          direccion: item.direccion,
        }));

         
    }

   





}



