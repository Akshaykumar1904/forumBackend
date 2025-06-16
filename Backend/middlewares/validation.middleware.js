import express from 'express';
import {body,param,validationResult} from 'express-validator';
import rateLimit from 'express-rate-limit';


const createLimiter = rateLimit({
  windowMs:15*60*1000,
  max:10,
  message:{
    error:'Too many requests,please try later!!'
  }
});

const authLimiter = rateLimit({
  windowMs:15*60*1000,
  max:5,
  message:{
    error:"Too many authentication requests/attempts,try again later!"
  }
})