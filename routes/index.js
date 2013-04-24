
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('../module/user.js');
exports.index = function(req,res){
    res.render('index',{
        title:'首页',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
};
exports.reg = function(req,res){
    res.render('reg',{
        title:'用户名注册',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
};
exports.doReg = function(req,res){
    if(req.body['password-repeat'] != req.body['password']){
        req.flash('error','两次输入的口令结果不一致');
        return req.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name:req.body.username,
        password:password
    });

    User.get(newUser.name,function(err,user){
        if(user)
            err = 'Username already exists.';
        if(err){
            req.flash('error',err);
            return res.redirect('/reg');
        }
        newUser.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');
            }
        });
        req.session.user = newUser;
        req.flash('success','注册成功');
        res.redirect('/');
    });
}
exports.login = function(req,res){
    res.render('login',{
        title:'登录',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    })
}
exports.dologin = function(req,res){
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username,function(err,user){
        if(!user){
            req.flash('error','用户不存在');
            return res.redirect('/login');
        }
        if(user.password != password){
            req.flash('error','用户口令错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success','登陆成功');
        res.redirect('/login');

    });
}
exports.logout = function (req,res){
    req.session.user = null;
    req.flash('success','登出成功');
    res.redirect('/');
}