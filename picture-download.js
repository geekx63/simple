/**
 * Created by yaokuo on 15/12/6.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var url = 'http://www.522pv.com/html/zipai/index2.html'

function filterPageUrl(html){
    var $ = cheerio.load(html);
    var pageUrlList = $('.newslist').find('ul a');

    pageUrlList.each(function(item){
        var url = $(this);
        var picture = {
            name:url.text(),
            pageUrl:url.attr('href')
        }
        getPicturePage(picture);
    })
}

function getPicturePage(picture){
    var html = '';
    var url = 'http://www.522pv.com'+picture.pageUrl
    http.get(url,function(res){
        res.on('data', function(data){
            html += data;
        })
        res.on('end', function(){
            filterPictureUrl(html);
        })
    }).on('error',function(){
        console.log('图片页面获取出错!');
    })
}

function filterPictureUrl(html){
    var $ = cheerio.load(html);
    var pictureUrl = '';
    var pictureUrlList = $('.ContentBox').find('img');
    pictureUrlList.each(function(item){
        var url = $(this).attr('src');
        if(url.indexOf('.jpeg')>0){
            console.log(url);
            download(url);
        }
    })
}

function download(url){
    var filename = url.substring(url.lastIndexOf('/')+1),
        writeStream = fs.createWriteStream('tmp1/'+filename);
    http.get(url,function(res){
        res.pipe(writeStream);
    }).on('error',function(){
        console.log('picture :'+ filename+'download fail');
    })
    writeStream.on('finish',function(){
        console.log('picture :'+ filename+'download finish');
    })
}
http.get(url, function(res){
    var html = '';
    res.on('data',function(data){
        html +=data;
    })
    res.on('end', function(){
        filterPageUrl(html);
    })
}).on('error', function(){
    console.log('页面获取出错！');
})

