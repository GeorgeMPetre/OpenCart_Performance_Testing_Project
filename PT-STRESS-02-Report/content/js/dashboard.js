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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25172811059907835, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.0, 500, 1500, "11 - Save Payment Methods"], "isController": true}, {"data": [0.0, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.975, 500, 1500, "GET Cart"], "isController": false}, {"data": [1.0, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": false}, {"data": [1.0, 500, 1500, "GET Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.0, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [0.03773584905660377, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.0, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.15384615384615385, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1450, 0, 0.0, 23942.627586206912, 0, 41681, 33877.0, 40628.700000000004, 41058.15, 41396.88, 7.533524182612626, 168.93784899375495, 3.149843176055862], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 20, 0, 0.0, 49.64999999999999, 29, 71, 51.0, 64.50000000000001, 70.69999999999999, 71.0, 0.2736801773447549, 0.36749047250882616, 0.17051557924409536], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1106.0, 1106, 1106, 1106.0, 1106.0, 1106.0, 1106.0, 0.9041591320072332, 0.013244518535262205, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 20, 0, 0.0, 3053.5, 2278, 3793, 3126.5, 3692.7000000000003, 3788.45, 3793.0, 0.2628120893561104, 0.29309707621550596, 0.1344858738501971], "isController": true}, {"data": ["11 - Save Payment Methods", 20, 0, 0.0, 7834.400000000001, 6960, 8715, 7813.5, 8694.4, 8714.5, 8715.0, 0.23956399353177216, 0.4159616997065341, 0.23816029825717194], "isController": true}, {"data": ["10 - Save Shipping Address ", 20, 0, 0.0, 10756.899999999998, 9090, 12114, 10905.0, 12008.5, 12109.8, 12114.0, 0.23492928628482826, 0.4836239604379082, 0.2863200676596344], "isController": true}, {"data": ["Get confirm ", 20, 0, 0.0, 51.849999999999994, 27, 66, 52.0, 62.800000000000004, 65.85, 66.0, 0.26430553720100436, 0.11202012025901942, 0.12492566406766221], "isController": false}, {"data": ["01 - Login", 28, 0, 0.0, 3803.4642857142862, 0, 5008, 4025.5, 4649.6, 4934.2, 5008.0, 0.1918189229367477, 0.16994225308451677, 0.10071296267751813], "isController": true}, {"data": ["Logout-1", 20, 0, 0.0, 121.70000000000002, 92, 176, 112.5, 161.10000000000002, 175.29999999999998, 176.0, 0.2643020443763132, 5.926663616180571, 0.11924564892759444], "isController": false}, {"data": ["POST Add to Cart", 20, 0, 0.0, 58.150000000000006, 36, 130, 51.5, 74.7, 127.24999999999996, 130.0, 0.27393132541671805, 0.30549763049403517, 0.1401757954280862], "isController": false}, {"data": ["Logout-0", 20, 0, 0.0, 27.650000000000006, 17, 44, 28.5, 41.60000000000001, 43.9, 44.0, 0.2645502645502646, 0.13718377976190477, 0.11548239087301589], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 7.486979166666666, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 20, 0, 0.0, 8228.7, 7220, 9041, 8154.5, 8969.800000000001, 9038.25, 9041.0, 0.2450770154521058, 0.3810181724606958, 0.20917706201673877], "isController": true}, {"data": ["GET Cart", 20, 0, 0.0, 221.7, 110, 509, 171.0, 395.0, 503.29999999999995, 509.0, 0.2758506544556777, 16.024929571879785, 0.12014589051487524], "isController": false}, {"data": ["POST Save Shipping Method", 20, 0, 0.0, 34.9, 19, 49, 34.5, 42.60000000000001, 48.699999999999996, 49.0, 0.2650340568763086, 0.2233636631682171, 0.13821111950385623], "isController": false}, {"data": ["GET Home", 22, 0, 0.0, 239.86363636363637, 125, 353, 255.0, 337.9, 351.04999999999995, 353.0, 0.1581789291286498, 5.495945429168194, 0.07090246920903345], "isController": false}, {"data": ["00 - Register", 530, 0, 0.0, 35294.23207547171, 4736, 41681, 38987.0, 41174.0, 41309.35, 41494.21, 2.7746366796498725, 71.19352587774061, 1.158740056461239], "isController": false}, {"data": ["GET Checkout", 20, 0, 0.0, 184.65, 115, 310, 164.5, 270.8, 308.09999999999997, 310.0, 0.27254640102477445, 17.72296850726336, 0.12376374655910168], "isController": false}, {"data": ["GET Set Shipping Address", 10, 0, 0.0, 44.9, 30, 58, 43.5, 57.7, 58.0, 58.0, 3.273322422258593, 1.3873261047463175, 1.464044599018003], "isController": false}, {"data": ["Search Product", 20, 0, 0.0, 176.70000000000005, 116, 296, 165.0, 256.0000000000001, 294.2, 296.0, 0.2756453546866601, 9.607398105971857, 0.13378490359303719], "isController": false}, {"data": ["Logout", 20, 0, 0.0, 149.9, 110, 208, 150.0, 191.10000000000002, 207.2, 208.0, 0.26422173487991124, 6.061876188997807, 0.23454839551351495], "isController": false}, {"data": ["07 - View Cart", 20, 0, 0.0, 4075.5500000000006, 3233, 5011, 3989.0, 4830.6, 5002.05, 5011.0, 0.25926213994970315, 15.061256757019523, 0.11292081486090587], "isController": true}, {"data": ["GET payment_address (extract address_id)", 10, 0, 0.0, 45.5, 26, 54, 50.0, 54.0, 54.0, 54.0, 5.621135469364812, 2.3823953063518832, 2.590992130410343], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 1.220703125, 0.0], "isController": false}, {"data": ["GET Category ", 10, 0, 0.0, 194.79999999999998, 163, 231, 194.5, 230.5, 231.0, 231.0, 3.869969040247678, 143.5516640866873, 1.783813854489164], "isController": false}, {"data": ["04 - Search", 22, 0, 0.0, 3197.6363636363635, 0, 4449, 3262.5, 4396.5, 4446.75, 4449.0, 0.16260763516759674, 5.152326282382941, 0.07174715436638457], "isController": true}, {"data": ["POST Save Payment (auto)", 20, 0, 0.0, 34.699999999999996, 21, 41, 36.0, 40.900000000000006, 41.0, 41.0, 0.26493224357870476, 0.22301913473129248, 0.13815802545998862], "isController": false}, {"data": ["Get Registration Page", 530, 0, 0.0, 31066.96981132075, 109, 37467, 34845.0, 36850.3, 37058.35, 37283.049999999996, 2.8633480642686577, 73.32026058493338, 1.0905329541648208], "isController": false}, {"data": ["08 - Checkout Page", 20, 0, 0.0, 3245.75, 2702, 4069, 3190.0, 3855.7000000000003, 4059.25, 4069.0, 0.2618795092377997, 17.029328868287703, 0.11891989433161804], "isController": true}, {"data": ["03 - Browse Category", 10, 0, 0.0, 4032.6, 3240, 4826, 4211.0, 4790.2, 4826.0, 4826.0, 1.7664723547076486, 65.52508390743685, 0.8142333509980569], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 20, 0, 0.0, 54.400000000000006, 32, 91, 57.5, 71.4, 90.04999999999998, 91.0, 0.26468330642386384, 0.24193708477806306, 0.13957908737195945], "isController": false}, {"data": ["13 - Logout", 20, 0, 0.0, 2844.2000000000003, 2366, 3508, 2859.0, 3102.5, 3487.8999999999996, 3508.0, 0.25617706959050096, 5.8773123983297255, 0.227407183845474], "isController": true}, {"data": ["02 - Home", 26, 0, 0.0, 2495.3461538461534, 0, 3458, 2861.0, 3445.0, 3453.45, 3458.0, 0.18350307367648408, 5.3949379839011335, 0.06959938544114844], "isController": true}, {"data": ["GET Shipping Methods", 20, 0, 0.0, 40.15, 29, 48, 40.5, 47.800000000000004, 48.0, 48.0, 0.26730463372582564, 0.26834879245131715, 0.12660424546584514], "isController": false}, {"data": ["Submit Registration", 29, 0, 0.0, 196.68965517241378, 167, 286, 195.0, 225.0, 256.5, 286.0, 0.19880443128222003, 0.18967961851829, 0.13355833796067784], "isController": false}, {"data": ["GET Payment Methods", 20, 0, 0.0, 38.05000000000001, 21, 47, 39.5, 46.0, 46.95, 47.0, 0.26669867050712753, 0.23857029510207892, 0.1260567934818845], "isController": false}, {"data": ["GET Product", 20, 0, 0.0, 182.85, 117, 269, 177.0, 241.0, 267.59999999999997, 269.0, 0.27376259307928164, 9.541775957826873, 0.12752417665900131], "isController": false}, {"data": ["05 - Product Page", 20, 0, 0.0, 3881.25, 2893, 5016, 3939.0, 4428.6, 4986.7, 5016.0, 0.2630229224476913, 9.167453338089665, 0.12252141992924682], "isController": true}, {"data": ["12 - Confirm Order", 20, 0, 0.0, 5446.499999999998, 4399, 6344, 5476.0, 6100.1, 6332.5, 6344.0, 0.24721878862793575, 0.3307516996291718, 0.2472187886279357], "isController": true}, {"data": ["Post Login", 26, 0, 0.0, 32.38461538461538, 18, 43, 32.0, 39.6, 42.3, 43.0, 0.18285006997531522, 0.1744575374666826, 0.10338885792549563], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1450, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
