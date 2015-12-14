window.twttr.ready(function (twttr) {
    'use strict';

    /*
     * 必要なときにだけMilkcocoaに接続するため、各処理の終わりに必ずdisconnect()する
     */

    var now = new Date(),
        appId = "hotic23lr8n",
        dsName = 'clicked',
        strToday = (now.getFullYear().toString() + "-" + (("0" + (now.getMonth() + 1)).slice(-2)).toString() + "-" + (("0" + now.getDate()).slice(-2)).toString()),
        /**
         * クリック数をpushする関数
         */
        pushCount = function (id) {
            var mk = new window.MilkCocoa(appId + '.mlkcca.com'),
                ds = mk.dataStore(dsName),
                dsSite = ds.child(window.location.href);

            dsSite.get(id, function (err, datum) {
                var clicked;

                if (!err) {
                    clicked = Number(datum.value.clicked) + 1;
                } else {
                    // エラー時
                    if (err === "not found") {
                        clicked = Number(1);
                    } else {
                        // そのほかのエラーは何もしない
                        window.console.log(err);
                        mk.disconnect();
                        return;
                    }
                }

                dsSite.set(id, {
                    "clicked": clicked.toString()
                }, function (err, pushed) {
                    mk.disconnect();
                });
            });
        };

    (function () {
        var mk = new window.MilkCocoa(appId + '.mlkcca.com'),
            ds = mk.dataStore(dsName),
            dsSite = ds.child(window.location.href);

        dsSite.get("total", function (err, datum) {
            var div = document.createElement('div'),
                btn = document.getElementById('btn');
            btn.parentNode.appendChild(div);

            if (!err) {
                div.textContent = datum.value.clicked.toString();
            } else {
                //エラー時
                if (err === "not found") {
                    div.textContent = "0";
                } else {
                    window.console.log(err);
                }
            }
            mk.disconnect();
        });
    }());

    // Twitterボタンクリック時の処理
    twttr.events.bind('click', function () {
        pushCount(strToday);
        pushCount("total");
    });
});
