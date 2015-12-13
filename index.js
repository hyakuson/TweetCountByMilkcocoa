window.twttr.ready(function (twttr) {
    'use strict';

    var mk = new window.MilkCocoa('hotic23lr8n.mlkcca.com'),
        ds = mk.dataStore('clicked'),
        //dsSite = ds.child(window.location.href),
        dsSite = ds.child("test"),
        now = new Date(),
        strToday = (now.getFullYear().toString() + "-" + (("0" + (now.getMonth() + 1)).slice(-2)).toString() + "-" + (("0" + now.getDate()).slice(-2)).toString()),

        setCount = function (id) {
            dsSite.get(id, function (err, datum) {
                var clicked = Number(datum.value.clicked);
                dsSite.set(id, {
                    "clicked": clicked + 1
                }, function (err, pushed) {
                    console.log(pushed.value.clicked);
                });
            });
        };

    dsSite.get("total", function (err, datum) {
        var div = document.createElement('div'),
            btn = document.getElementById('btn');
        btn.parentNode.appendChild(div);

        if (err) {
            console.log(err);

            if (err === "not found") {
                dsSite.set("total", {
                    "clicked": "0"
                }, function (err, pushed) {
                    console.log(pushed.id + pushed.value.clicked);
                    div.textContent = "0";
                });
                dsSite.set(strToday, {
                    "clicked": "0"
                }, function (err, pushed) {
                    console.log(pushed.id + pushed.value.clicked);
                });
            }
            return;
        }
        div.textContent = datum.value.clicked.toString();
    });

    // Twitterボタンクリック時の処理
    twttr.events.bind('click', function () {
        setCount(strToday);
        setCount("total");
    });
});
