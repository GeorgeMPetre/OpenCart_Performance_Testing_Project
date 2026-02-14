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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.016530080089402124, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.5842696629213483, 500, 1500, "10 - Save Shipping Address "], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [0.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.19088937093275488, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [0.0, 500, 1500, "GET Cart"], "isController": false}, {"data": [0.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": false}, {"data": [0.0, 500, 1500, "GET Checkout"], "isController": false}, {"data": [0.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [0.0, 500, 1500, "Search Product"], "isController": false}, {"data": [0.0, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [0.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [0.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [0.01, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [0.0, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [0.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [0.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.059, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6189, 0, 0.0, 22271.428179027323, 0, 84530, 28495.0, 35903.0, 36817.0, 39410.800000000025, 20.30092205351256, 501.87628144137693, 9.827230540849497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 176, 0, 0.0, 6278.170454545453, 1961, 11081, 6214.5, 9963.800000000001, 10475.15, 10912.369999999997, 7.400243871673044, 9.958531303872514, 4.61069881848379], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1231.0, 1231, 1231, 1231.0, 1231.0, 1231.0, 1231.0, 0.8123476848090982, 0.011899624289195774, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 500, 0, 0.0, 9440.64999999999, 7055, 18930, 9345.0, 10841.7, 11258.7, 11779.28, 5.318583129454313, 5.931466732262525, 2.7216187107754495], "isController": true}, {"data": ["10 - Save Shipping Address ", 89, 0, 0.0, 2968.3033707865166, 0, 13102, 0.0, 7570.0, 8512.0, 13102.0, 6.44134037779547, 1.2076099641745675, 1.2319939883838749], "isController": false}, {"data": ["01 - Login", 500, 0, 0.0, 10891.246, 3871, 22507, 9919.0, 17482.8, 18399.85, 19784.760000000002, 7.921168530781661, 7.557599272044612, 4.478863846994709], "isController": true}, {"data": ["POST Add to Cart", 500, 0, 0.0, 6452.331999999999, 4573, 16092, 6284.0, 7811.5, 8077.299999999999, 8665.66, 5.457621568520438, 6.086527178955412, 2.7927672870163183], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 4.296875, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 461, 0, 0.0, 12647.555314533613, 0, 27342, 10438.0, 25232.6, 25880.6, 26779.66, 11.80144894145355, 10.110120590456441, 7.208507731101041], "isController": true}, {"data": ["GET Cart", 500, 0, 0.0, 29839.45400000001, 18521, 34157, 30760.5, 32847.4, 33249.85, 33636.14, 4.826347998996119, 280.3861214140234, 2.102100788625263], "isController": false}, {"data": ["GET Home", 500, 0, 0.0, 30388.333999999977, 10602, 36119, 32742.5, 34377.9, 34844.6, 35604.15, 6.142581604196612, 213.42471767159302, 2.7533642151623483], "isController": false}, {"data": ["00 - Register", 550, 0, 0.0, 53940.776363636345, 3774, 85956, 54937.5, 64512.0, 74056.55, 77270.85, 6.328385686342193, 174.099710728052, 6.275023641554482], "isController": false}, {"data": ["GET Checkout", 499, 0, 0.0, 29651.955911823672, 18906, 54614, 29366.0, 32973.0, 33712.0, 34631.0, 6.9167221113328905, 449.78334888382955, 3.140894318134564], "isController": false}, {"data": ["GET Set Shipping Address", 37, 0, 0.0, 3615.81081081081, 2175, 5407, 3514.0, 4974.400000000001, 5200.0, 5407.0, 3.95088093966898, 1.674494460758142, 1.7670932327816338], "isController": false}, {"data": ["Search Product", 500, 0, 0.0, 34311.83200000002, 28900, 53166, 34784.0, 37166.0, 37439.6, 37780.75, 4.51924293642329, 156.04234431772989, 2.193421620510132], "isController": false}, {"data": ["07 - View Cart", 500, 0, 0.0, 33621.781999999956, 22683, 39034, 34404.0, 36696.7, 37111.6, 38045.87, 4.624405763859344, 268.65431092885814, 2.0141454791809252], "isController": true}, {"data": ["GET payment_address (extract address_id)", 373, 0, 0.0, 6807.495978552279, 1750, 10636, 7200.0, 9432.800000000001, 9628.6, 10165.199999999999, 10.878124179766106, 4.610454974627431, 5.014135364110939], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 0.4475911458333333, 0.0], "isController": false}, {"data": ["GET Category ", 500, 0, 0.0, 35695.78, 30064, 84530, 35764.5, 37750.7, 38934.45, 40284.380000000005, 5.19226974879799, 196.40344455175136, 2.3933118373365736], "isController": false}, {"data": ["04 - Search", 500, 0, 0.0, 37799.630000000005, 31746, 56577, 38282.0, 40907.4, 41447.75, 41982.91, 4.366812227074235, 150.77915188318778, 2.1194391375545854], "isController": true}, {"data": ["Get Registration Page", 550, 0, 0.0, 33890.35090909088, 384, 67011, 34202.5, 37183.9, 58976.89999999998, 60500.42, 7.915833105453289, 210.90593224226768, 3.014819249147249], "isController": false}, {"data": ["08 - Checkout Page", 499, 0, 0.0, 32669.55110220444, 22545, 57123, 32465.0, 35944.0, 36756.0, 37596.0, 6.6174227856830266, 430.32039362227647, 3.0049820267017653], "isController": true}, {"data": ["03 - Browse Category", 500, 0, 0.0, 39435.36399999998, 34146, 88774, 39555.0, 41689.3, 42721.35, 43944.73, 5.012430828454567, 189.60083507097602, 2.310417334990777], "isController": true}, {"data": ["02 - Home", 500, 0, 0.0, 33052.11800000003, 12716, 39229, 35363.0, 37133.5, 37688.35, 38642.79, 5.970149253731344, 207.4335354477612, 2.67607276119403], "isController": true}, {"data": ["GET Shipping Methods", 1, 0, 0.0, 1899.0, 1899, 1899, 1899.0, 1899.0, 1899.0, 1899.0, 0.526592943654555, 0.5286499473407056, 0.24941169694576093], "isController": false}, {"data": ["Submit Registration", 500, 0, 0.0, 13697.838000000005, 2517, 20239, 12242.0, 18921.9, 19345.7, 20110.77, 7.629045301270999, 7.278884042325943, 5.125034688315354], "isController": false}, {"data": ["GET Product", 500, 0, 0.0, 31222.78999999999, 24893, 37804, 30770.5, 34898.8, 36252.3, 37525.97, 4.469952976094691, 154.3404395807631, 2.082194892184734], "isController": false}, {"data": ["05 - Product Page", 500, 0, 0.0, 34662.72000000003, 28572, 41777, 34176.0, 38261.1, 39732.35, 41150.130000000005, 4.345181194055792, 150.03226636503868, 2.0240736616841923], "isController": true}, {"data": ["Post Login", 500, 0, 0.0, 6909.190000000001, 593, 17663, 5984.5, 13320.9, 14358.449999999999, 15541.810000000001, 8.409297319116014, 8.023323711695651, 4.754866355242356], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6189, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
