const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index');
});
router.get('/about', (req, res) =>{
    res.render('about');
});
router.get('/dashboards', (req, res) =>{
    res.render('dashboards');
});
router.get('/dashboards-simulated', (req, res) =>{
    res.render('dashboards-simulated');
});
router.get('/dashboards-rb', (req, res) =>{
    res.render('dashboards-rb');
});
router.get('/dashboards-stp', (req, res) =>{
    res.render('dashboards-stp');
});

router.post('/dashboards', (req, res) => {
    console.log(req.body);
    const { options } = req.body;
    console.log(options);
    const errors = [];
    if (typeof options == 'undefined'){
        errors.push({text: 'Please choose a board'});
    }
    if (errors.length >0){
        res.render('dashboards', {
            errors
        });
    }else{
        // WS PARA CADA UNA DE LAS OPCIONES
        
        if(options == 'simulated'){
            res.redirect('dashboards-simulated');
        }
        if(options == 'raspberry'){
            res.redirect('dashboards-rb');
            
        }
        if(options == 'stp'){
            res.redirect('dashboards-stp');
            
        }
        
    }
    
   
});
module.exports = router;