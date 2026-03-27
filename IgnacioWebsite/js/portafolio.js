let proyects = document.getElementsByClassName('proyect');
let names = {
    'ecobottle': 'https://ecobottle.vercel.app/',
    'lego': 'https://lego-amber.vercel.app/', 
    'techplus': 'https://podcast-seven-pink.vercel.app/'
};

Array.from(proyects).forEach(proyect => {
    proyect.addEventListener('click',  () => {
        if (names[proyect.id]) {
            console.log(proyect.id)
            const url = names[proyect.id]
            if (url) {
            // '_blank' es lo que indica al navegador que abra una pestaña nueva
            window.open(url, '_blank');
            
        }
        }
    })
})