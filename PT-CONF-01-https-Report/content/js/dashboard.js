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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9543396226415094, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "04 - Search"], "isController": true}, {"data": [0.975, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2530, 0, 0.0, 58.523715415019744, 3, 1148, 50.0, 78.0, 123.0, 198.3800000000001, 1.945419076333477, 4.672282039773824, 0.9927342766597386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Category ", 20, 0, 0.0, 176.70000000000002, 134, 240, 178.0, 206.60000000000002, 238.34999999999997, 240.0, 0.07155635062611806, 2.717331451252236, 0.0329830053667263], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1148.0, 1148, 1148, 1148.0, 1148.0, 1148.0, 1148.0, 0.8710801393728222, 0.012759962979094078, 0.0], "isController": false}, {"data": ["04 - Search", 20, 0, 0.0, 4857.0, 3065, 6493, 4573.5, 6214.5, 6479.15, 6493.0, 0.07046868723882542, 2.412575335430951, 0.03420208745868773], "isController": true}, {"data": ["Get Registration Page", 20, 0, 0.0, 188.3, 137, 555, 169.5, 207.70000000000002, 537.6999999999998, 555.0, 0.07030049948504884, 1.8736044252406914, 0.026774604296063525], "isController": false}, {"data": ["01 - Login", 20, 0, 0.0, 4968.85, 3919, 6109, 4952.5, 5950.000000000001, 6102.35, 6109.0, 0.06928158460840317, 0.06664293050710655, 0.03917386473463421], "isController": true}, {"data": ["POST Add to Cart", 2387, 0, 0.0, 52.69543359865938, 22, 397, 49.0, 74.0, 79.0, 95.11999999999989, 1.88562093568508, 2.117640699255705, 0.9649075881825996], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 7.161458333333333, 0.0], "isController": false}, {"data": ["03 - Browse Category", 20, 0, 0.0, 4655.049999999999, 3487, 5838, 4703.5, 5828.400000000001, 5837.8, 5838.0, 0.07015451531999228, 2.664097166196047, 0.03233684690530895], "isController": true}, {"data": ["GET Home", 20, 0, 0.0, 150.55000000000004, 113, 193, 148.0, 177.9, 192.25, 193.0, 0.07093229866753677, 2.4651051881656554, 0.03179484871914002], "isController": false}, {"data": ["00 - Register", 20, 0, 0.0, 10840.3, 8658, 12215, 10857.5, 11816.1, 12195.1, 12215.0, 0.06758994531973424, 1.8663801697859428, 0.07115095855215578], "isController": true}, {"data": ["02 - Home", 20, 0, 0.0, 3732.35, 2717, 5084, 3692.5, 4812.900000000001, 5071.9, 5084.0, 0.0698428884224936, 2.427244990518828, 0.031306529087816955], "isController": true}, {"data": ["Search Product", 20, 0, 0.0, 158.15, 123, 185, 154.5, 184.70000000000002, 185.0, 185.0, 0.07119413929845295, 2.4374120084934607, 0.034554186749346794], "isController": false}, {"data": ["Submit Registration", 20, 0, 0.0, 202.39999999999998, 176, 234, 202.5, 221.10000000000002, 233.39999999999998, 234.0, 0.07034327518289252, 0.06766418560073158, 0.04725845328327237], "isController": false}, {"data": ["GET Product", 20, 0, 0.0, 149.1, 106, 189, 150.5, 185.00000000000003, 188.85, 189.0, 0.07119236533074193, 2.4373512746993016, 0.03316284986598037], "isController": false}, {"data": ["05 - Product Page", 20, 0, 0.0, 4521.3, 3484, 6016, 4512.5, 5428.900000000001, 5988.549999999999, 6016.0, 0.07013876955556568, 2.4012802298096783, 0.03267206355273909], "isController": true}, {"data": ["Post Login", 20, 0, 0.0, 30.9, 16, 45, 32.0, 36.900000000000006, 44.599999999999994, 45.0, 0.07040617321326734, 0.06772468810065267, 0.03980974051804863], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 8.0, 125.0, 1.220703125, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2530, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
