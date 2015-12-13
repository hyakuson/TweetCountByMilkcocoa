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
                var clicked = Number(datum.value.clicked);

                dsSite.set(id, {
                    "clicked": clicked + 1
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
                mk.disconnect();
                return;
            }

            /*
             * ページアクセス時にデータストアを確実に作成しておく
             */
            if (err === "not found") {
                // データがまだないとき

                // 総クリック数を取得・設定する
                dsSite.set("total", {
                    "clicked": "0"
                }, function (err, pushed) {
                    div.textContent = "0";

                    // 今日のクリック数を取得・作成する
                    dsSite.get(strToday, function (err, datum) {
                        dsSite.set(strToday, {
                            "clicked": "0"
                        }, function (err, pushed) {
                            mk.disconnect();
                        });
                    });
                });
            } else {
                // 他のエラー
                mk.disconnect();
                div.textContent = "!";
            }
        });
    }());

    // Twitterボタンクリック時の処理
    twttr.events.bind('click', function () {
        pushCount(strToday);
        pushCount("total");
    });
});
