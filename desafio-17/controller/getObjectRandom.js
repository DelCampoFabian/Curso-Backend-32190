const getObject = () => {
    let cant = process.env.CANT_BUCLE;
    if (!cant){
        cant = 100000000;
    }
    let arr = [];
    let data = {};

   
    for (let i = 0; i <= 1000; i++) {
        arr[i] = 0;
    }

    for (let i = 0; i <= cant; i++) {
        let numRandom = Math.floor((Math.random() * (1001 - 1) + 1));
        arr[numRandom]++;
    }

    for (let i = 0; i <= arr.length - 1; i++) {
        data[i] = {
            vecesQueAparece: arr[i]
        }
    }

    return (data);
}
const objectAleatorio = getObject();

process.send(objectAleatorio);