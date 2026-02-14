/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16240326106220832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21641791044776118, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.3153153153153153, 500, 1500, "11 - Save Payment Methods"], "isController": false}, {"data": [0.04145936981757877, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.044374009508716325, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.2172573189522342, 500, 1500, "GET Cart"], "isController": false}, {"data": [0.4894366197183099, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [0.20923076923076922, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.20425867507886436, 500, 1500, "GET Checkout"], "isController": false}, {"data": [0.2604166666666667, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [0.21, 500, 1500, "Search Product"], "isController": false}, {"data": [0.975, 500, 1500, "Logout"], "isController": false}, {"data": [0.0015384615384615385, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [0.14363636363636365, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [0.05909090909090909, 500, 1500, "GET Category "], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [0.9711538461538461, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [0.16, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.018575851393188854, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.0, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [0.37679425837320574, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [0.2076923076923077, 500, 1500, "Submit Registration"], "isController": false}, {"data": [0.7138157894736842, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [0.22384615384615383, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [0.23076923076923078, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10075, 0, 0.0, 13000.694789081876, 0, 42964, 6230.0, 33386.799999999996, 35284.6, 39353.72, 20.66149599484847, 398.1169832562415, 10.349731628059233], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 603, 0, 0.0, 3424.7810945273623, 24, 9605, 3300.0, 7622.6, 8252.399999999998, 9031.92000000001, 2.6714276853829046, 3.5949485844312914, 1.6644246711663018], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1223.0, 1223, 1223, 1223.0, 1223.0, 1223.0, 1223.0, 0.8176614881439085, 0.011977463205233033, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 650, 0, 0.0, 8061.036923076912, 2223, 12573, 9090.5, 10967.4, 11388.749999999998, 11987.060000000001, 2.042573516934506, 2.2779481995500053, 1.045223166868829], "isController": true}, {"data": ["11 - Save Payment Methods", 222, 0, 0.0, 5080.22072072072, 0, 13195, 6110.0, 8553.1, 8933.1, 12294.960000000017, 1.441801862652136, 1.4516452453011548, 0.8188273669580579], "isController": false}, {"data": ["10 - Save Shipping Address ", 603, 0, 0.0, 10511.81260364843, 0, 24267, 10637.0, 17202.000000000004, 18561.2, 20742.24000000001, 2.7901553325282142, 4.08464729174475, 2.694079263200026], "isController": true}, {"data": ["Get confirm ", 100, 0, 0.0, 48.32999999999999, 24, 137, 45.5, 64.9, 84.74999999999994, 136.99, 1.2429926290537099, 0.5268152353606543, 0.5875082348261675], "isController": false}, {"data": ["01 - Login", 650, 0, 0.0, 8737.118461538468, 3146, 16246, 8602.0, 13486.0, 13916.45, 14525.460000000001, 1.4155021439413242, 1.3505328072565173, 0.8003669349043229], "isController": true}, {"data": ["Logout-1", 100, 0, 0.0, 239.33, 103, 485, 217.5, 404.70000000000005, 451.74999999999994, 484.7999999999999, 1.2301182143604, 27.583959412249516, 0.5549947412446335], "isController": false}, {"data": ["POST Add to Cart", 650, 0, 0.0, 5058.621538461543, 24, 9346, 6124.5, 7937.9, 8342.8, 8794.16, 2.05626575811355, 2.293218257583666, 1.0522297434096681], "isController": false}, {"data": ["Logout-0", 100, 0, 0.0, 36.98000000000001, 15, 106, 32.0, 63.80000000000001, 74.74999999999994, 105.93999999999997, 1.2319670818395732, 0.6388423051336067, 0.5377825054514543], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 3.90625, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 631, 0, 0.0, 15082.125198098263, 0, 29630, 15240.0, 22861.4, 24110.4, 25881.319999999996, 2.5622908748335123, 4.241644954703083, 2.5550339904533343], "isController": true}, {"data": ["GET Cart", 649, 0, 0.0, 22098.28505392909, 99, 33436, 26962.0, 31798.0, 32233.0, 32970.5, 2.108066847481851, 122.471684397991, 0.9181619277118217], "isController": false}, {"data": ["POST Save Shipping Method", 284, 0, 0.0, 1084.9507042253515, 18, 3218, 1291.0, 2139.0, 2752.5, 3161.0499999999984, 1.9297673407262448, 1.6263566553190911, 1.006343515574038], "isController": false}, {"data": ["GET Home", 650, 0, 0.0, 21575.799999999985, 102, 36878, 26584.0, 32043.8, 32437.7, 33953.280000000006, 1.45603447889646, 50.59008859829801, 0.652656079895972], "isController": false}, {"data": ["00 - Register", 650, 0, 0.0, 38966.489230769206, 7279, 59407, 46135.5, 57055.8, 57650.45, 58607.78, 1.3851566612183839, 38.22707738870266, 1.4580646817549294], "isController": true}, {"data": ["GET Checkout", 634, 0, 0.0, 23279.690851735006, 110, 35077, 28191.5, 33140.5, 33556.75, 34319.549999999996, 2.3155418879336165, 150.5780608569331, 1.0514911893448549], "isController": false}, {"data": ["GET Set Shipping Address", 528, 0, 0.0, 1846.768939393938, 25, 6295, 1651.0, 3305.2000000000003, 4044.1, 5338.300000000001, 5.917955615332885, 2.508196032279758, 2.6468981170141226], "isController": false}, {"data": ["Search Product", 650, 0, 0.0, 25058.313846153833, 113, 36577, 31684.5, 34280.7, 35160.6, 35713.9, 1.72945474283008, 59.42900960362893, 0.8393935617056149], "isController": false}, {"data": ["Logout", 100, 0, 0.0, 276.6, 120, 543, 258.0, 468.70000000000005, 509.0999999999998, 542.89, 1.229740032957033, 28.213166595956615, 1.0916344628495536], "isController": false}, {"data": ["07 - View Cart", 650, 0, 0.0, 25767.72153846153, 0, 37683, 30650.0, 35713.5, 36295.549999999996, 37079.35, 2.0851846029968915, 120.9559291973563, 0.9067984135755142], "isController": true}, {"data": ["GET payment_address (extract address_id)", 550, 0, 0.0, 4784.4218181818205, 25, 11482, 5447.5, 7819.400000000001, 8161.0, 9071.98, 5.007283321194465, 2.1222275013656224, 2.3080446558630734], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 0.2754407051282051, 0.0], "isController": false}, {"data": ["GET Category ", 550, 0, 0.0, 34448.941818181855, 145, 41438, 37891.0, 39794.7, 40290.2, 41070.090000000004, 2.0703777874813665, 78.92044855675847, 0.9543147614171925], "isController": false}, {"data": ["04 - Search", 650, 0, 0.0, 28552.333846153855, 2302, 40204, 35161.0, 37997.5, 38826.14999999999, 39861.1, 1.7145555212644452, 58.917029752648986, 0.8321622012387003], "isController": true}, {"data": ["POST Save Payment (auto)", 104, 0, 0.0, 84.97115384615378, 17, 1726, 30.0, 43.5, 79.25, 1719.5500000000004, 0.7277052793618585, 0.6125800300878145, 0.3794869327922192], "isController": false}, {"data": ["Get Registration Page", 650, 0, 0.0, 21863.849230769225, 106, 35433, 29849.5, 34452.2, 34767.25, 35333.5, 1.409397428391769, 37.55135745977797, 0.5367822237038965], "isController": false}, {"data": ["08 - Checkout Page", 646, 0, 0.0, 25793.38080495354, 0, 38648, 31098.0, 36171.4, 36597.6, 37641.57, 2.3295733202550273, 148.67644974017685, 1.0382121809458214], "isController": true}, {"data": ["03 - Browse Category", 550, 0, 0.0, 38233.996363636375, 3133, 45454, 41688.5, 43657.8, 44100.25, 44982.76, 2.0470600495760722, 78.03160288523809, 0.9435667416014709], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 100, 0, 0.0, 75.28999999999999, 29, 306, 61.0, 147.9, 159.5499999999999, 305.07999999999953, 1.2424984158145198, 1.1357212082054595, 0.6540103966054943], "isController": false}, {"data": ["13 - Logout", 100, 0, 0.0, 2927.8599999999988, 2038, 3720, 2943.0, 3372.0, 3522.1499999999996, 3719.69, 1.1940583655729091, 27.39454412344175, 1.0599600139704828], "isController": true}, {"data": ["02 - Home", 650, 0, 0.0, 24234.616923076912, 2018, 39212, 29217.5, 34735.1, 35164.6, 36260.61, 1.4490815052612807, 50.34850671454209, 0.6495394637841091], "isController": true}, {"data": ["GET Shipping Methods", 418, 0, 0.0, 1481.3253588516752, 20, 5096, 1483.0, 2919.1, 3137.0499999999975, 4074.5600000000013, 2.7489510581488643, 2.7596891482197585, 1.3019934210958977], "isController": false}, {"data": ["Submit Registration", 650, 0, 0.0, 9115.290769230778, 168, 15923, 10130.0, 14878.8, 15142.15, 15586.9, 1.4077216782641275, 1.3431094527969265, 0.9456734147971041], "isController": false}, {"data": ["GET Payment Methods", 152, 0, 0.0, 593.2828947368425, 19, 2666, 42.5, 1832.1000000000001, 1980.0999999999997, 2509.12, 1.038386129347388, 0.9288688422677807, 0.49079969394935136], "isController": false}, {"data": ["GET Product", 650, 0, 0.0, 24320.28923076921, 106, 42964, 30666.0, 33996.6, 34573.899999999994, 35489.880000000005, 1.876286338614839, 64.47456303726739, 0.8740122885930451], "isController": false}, {"data": ["05 - Product Page", 650, 0, 0.0, 27820.3107692308, 2430, 45895, 34287.5, 37672.299999999996, 38302.0, 39471.22, 1.8648366403103087, 64.08111866798305, 0.8686787865507982], "isController": true}, {"data": ["12 - Confirm Order", 100, 0, 0.0, 5432.86, 3986, 6572, 5428.0, 6093.900000000001, 6259.099999999999, 6570.119999999999, 1.1585606043052112, 1.550027370994277, 1.1574291974650694], "isController": true}, {"data": ["Post Login", 650, 0, 0.0, 4722.389230769224, 16, 11670, 4554.5, 9346.0, 9757.05, 10297.880000000001, 1.4288948926899936, 1.3633108497637927, 0.8079395926440491], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10075, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
