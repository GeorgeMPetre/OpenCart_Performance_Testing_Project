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

    var data = {"OkPercent": 83.37801608579089, "KoPercent": 16.621983914209114};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.01263001485884101, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.0, 500, 1500, "GET Cart"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "02 - Home"], "isController": true}, {"data": [0.0, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [0.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 373, 62, 16.621983914209114, 2336.1367292225204, 0, 5881, 2221.0, 2722.2, 4869.3, 4880.52, 5.781959665793431, 157.07425986459674, 2.0953306412859822], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Category ", 75, 4, 5.333333333333333, 2282.04, 180, 2706, 2288.0, 2546.4, 2570.6, 2706.0, 1.304370510791492, 46.03373197251256, 0.5691675072609959], "isController": false}, {"data": ["GET Cart", 50, 0, 0.0, 2219.0399999999995, 2144, 2360, 2203.5, 2312.7, 2335.95, 2360.0, 1.3853869385719433, 78.96976133246515, 0.6034009517608268], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.010866793397626112, 0.0], "isController": false}, {"data": ["03 - Browse Category", 75, 4, 5.333333333333333, 5291.920000000001, 2969, 6360, 5350.0, 6033.8, 6102.6, 6360.0, 1.2565339766787293, 44.345489121557094, 0.5482938362819997], "isController": true}, {"data": ["06 - Add to Cart", 51, 1, 1.9607843137254901, 5025.392156862747, 3194, 6112, 5031.0, 5871.0, 6026.4, 6112.0, 1.0086825814362848, 1.1718904516326814, 0.5060409703130871], "isController": true}, {"data": ["GET Home", 100, 22, 22.0, 2199.4200000000005, 1018, 2801, 2231.5, 2708.0, 2743.95, 2800.83, 1.5842337061563323, 42.78767703811666, 0.48269620734450747], "isController": false}, {"data": ["02 - Home", 100, 22, 22.0, 5301.540000000002, 4426, 6273, 5140.0, 6139.1, 6193.05, 6272.8099999999995, 1.5337188079937423, 41.4233485682735, 0.46730494931059346], "isController": true}, {"data": ["07 - View Cart", 50, 0, 0.0, 5126.76, 4182, 6087, 5141.0, 5776.7, 5910.7, 6087.0, 1.310753421066429, 74.71550506606197, 0.5708945564410423], "isController": true}, {"data": ["GET Product", 56, 4, 7.142857142857143, 2099.125, 58, 2499, 2201.5, 2265.9, 2284.95, 2499.0, 1.0601643254704478, 33.05564783021279, 0.45857135757828177], "isController": false}, {"data": ["05 - Product Page", 63, 4, 6.349206349206349, 4448.142857142858, 0, 6204, 4935.0, 5975.4, 6060.4, 6204.0, 1.1422976501305484, 31.659149798511386, 0.439198147845953], "isController": true}, {"data": ["POST Add to Cart", 51, 1, 1.9607843137254901, 2059.392156862745, 415, 2138, 2091.0, 2111.8, 2117.6, 2138.0, 1.0591900311526479, 1.2305701583592938, 0.5313798026998962], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 0.2754407051282051, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 31, 50.0, 8.310991957104557], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException", 31, 50.0, 8.310991957104557], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 373, 62, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 31, "Non HTTP response code: java.net.SocketException", 31, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET Category ", 75, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["03 - Browse Category", 4, 4, "Non HTTP response code: java.net.SocketException", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["06 - Add to Cart", 1, 1, "Non HTTP response code: java.net.SocketException", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Home", 100, 22, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02 - Home", 23, 22, "Non HTTP response code: java.net.SocketException", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Product", 56, 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05 - Product Page", 11, 4, "Non HTTP response code: java.net.SocketException", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Add to Cart", 51, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
