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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9694317605276509, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3822, 0, 0.0, 54.64992150706427, 5, 1139, 49.0, 74.0, 82.0, 179.0, 2.7822790228391474, 5.484725827540559, 1.4211161371728347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Category ", 20, 0, 0.0, 170.39999999999998, 134, 235, 168.0, 216.50000000000009, 234.25, 235.0, 0.0697953600044669, 2.650458348310254, 0.03217129875205896], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.01286078797190518, 0.0], "isController": false}, {"data": ["04 - Search", 20, 0, 0.0, 4547.2, 3449, 6006, 4588.0, 5807.000000000001, 5998.15, 6006.0, 0.0689816922588745, 2.3739065862857496, 0.03348037212173889], "isController": true}, {"data": ["Get Registration Page", 20, 0, 0.0, 187.15, 136, 496, 172.5, 192.5, 480.8499999999998, 496.0, 0.0699422976044763, 1.8640578553942997, 0.026638179751704846], "isController": false}, {"data": ["01 - Login", 20, 0, 0.0, 5183.799999999999, 3797, 6486, 5253.5, 6121.3, 6467.799999999999, 6486.0, 0.06858663520826332, 0.06597444890638611, 0.038780919712484825], "isController": true}, {"data": ["POST Add to Cart", 3679, 0, 0.0, 50.65914650720309, 23, 103, 48.0, 70.0, 76.0, 84.0, 2.7521089652623854, 3.0907473730974058, 1.4083057595678614], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 4.296875, 0.0], "isController": false}, {"data": ["03 - Browse Category", 20, 0, 0.0, 4963.8, 3469, 6234, 5019.0, 6115.1, 6228.3, 6234.0, 0.06862735005781855, 2.606103512776697, 0.03163291916727574], "isController": true}, {"data": ["GET Home", 20, 0, 0.0, 147.65000000000003, 119, 189, 149.0, 174.00000000000003, 188.29999999999998, 189.0, 0.06988681829776676, 2.428771682385377, 0.031326220311206], "isController": false}, {"data": ["00 - Register", 20, 0, 0.0, 10764.449999999999, 8744, 11711, 10924.5, 11582.300000000001, 11705.3, 11711.0, 0.06749437265667975, 1.8637410949612074, 0.07103716809642245], "isController": true}, {"data": ["02 - Home", 20, 0, 0.0, 3897.6, 2921, 5079, 4031.5, 4584.3, 5054.299999999999, 5079.0, 0.06894578448237229, 2.3960680003654122, 0.030904409255282105], "isController": true}, {"data": ["Search Product", 20, 0, 0.0, 163.04999999999998, 131, 222, 165.0, 179.9, 219.89999999999998, 222.0, 0.06975811374060445, 2.4006260245722957, 0.03385720950105509], "isController": false}, {"data": ["Submit Registration", 20, 0, 0.0, 209.45000000000005, 184, 245, 209.0, 228.70000000000002, 244.2, 245.0, 0.06990660477601925, 0.06724414619568257, 0.04695143304170628], "isController": false}, {"data": ["GET Product", 20, 0, 0.0, 156.85, 118, 202, 157.5, 187.8, 201.29999999999998, 202.0, 0.07008641655160813, 2.4119240977249947, 0.03264767646007527], "isController": false}, {"data": ["05 - Product Page", 20, 0, 0.0, 4823.45, 2852, 6313, 4856.0, 6174.700000000001, 6306.85, 6313.0, 0.06868202625713864, 2.363594008094177, 0.03199348293423353], "isController": true}, {"data": ["Post Login", 20, 0, 0.0, 32.6, 19, 38, 33.0, 38.0, 38.0, 38.0, 0.06992469110767703, 0.06726154369244323, 0.039537496241547856], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 0.9765625, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3822, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
