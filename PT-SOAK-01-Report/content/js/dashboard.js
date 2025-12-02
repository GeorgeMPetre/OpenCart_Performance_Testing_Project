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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5943155452436195, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "POST checkout/shipping_address|save (existing)"], "isController": false}, {"data": [0.5, 500, 1500, "SELECT COUNT(*) AS count_before_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "06 - Add to Cart"], "isController": true}, {"data": [0.0, 500, 1500, "11 - Save Payment Methods"], "isController": true}, {"data": [0.007692307692307693, 500, 1500, "10 - Save Shipping Address "], "isController": true}, {"data": [1.0, 500, 1500, "Get confirm "], "isController": false}, {"data": [0.0, 500, 1500, "01 - Login"], "isController": true}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "SELECT COUNT(*) AS count_after_cleanup"], "isController": false}, {"data": [0.0, 500, 1500, "09 - Save Payment Address"], "isController": true}, {"data": [1.0, 500, 1500, "GET Cart"], "isController": false}, {"data": [1.0, 500, 1500, "POST Save Shipping Method"], "isController": false}, {"data": [1.0, 500, 1500, "GET Home"], "isController": false}, {"data": [0.0, 500, 1500, "00 - Register"], "isController": true}, {"data": [1.0, 500, 1500, "GET Checkout"], "isController": false}, {"data": [1.0, 500, 1500, "GET Set Shipping Address"], "isController": false}, {"data": [1.0, 500, 1500, "Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [0.014814814814814815, 500, 1500, "07 - View Cart"], "isController": true}, {"data": [1.0, 500, 1500, "GET payment_address (extract address_id)"], "isController": false}, {"data": [1.0, 500, 1500, "Cleanup all load test data"], "isController": false}, {"data": [1.0, 500, 1500, "GET Category "], "isController": false}, {"data": [0.0072992700729927005, 500, 1500, "04 - Search"], "isController": true}, {"data": [1.0, 500, 1500, "POST Save Payment (auto)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Registration Page"], "isController": false}, {"data": [0.0, 500, 1500, "08 - Checkout Page"], "isController": true}, {"data": [0.0, 500, 1500, "03 - Browse Category"], "isController": true}, {"data": [1.0, 500, 1500, "Post extension/payment/cod/confirm"], "isController": false}, {"data": [0.0, 500, 1500, "13 - Logout"], "isController": true}, {"data": [0.007194244604316547, 500, 1500, "02 - Home"], "isController": true}, {"data": [1.0, 500, 1500, "GET Shipping Methods"], "isController": false}, {"data": [1.0, 500, 1500, "Submit Registration"], "isController": false}, {"data": [1.0, 500, 1500, "GET Payment Methods"], "isController": false}, {"data": [1.0, 500, 1500, "GET Product"], "isController": false}, {"data": [0.0, 500, 1500, "05 - Product Page"], "isController": true}, {"data": [0.0, 500, 1500, "12 - Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "Post Login"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2572, 0, 0.0, 889.4790046656296, 0, 296378, 72.0, 186.0, 204.0, 235.80999999999995, 0.05838292685279819, 0.9598749628651558, 0.029948125779228778], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST checkout/shipping_address|save (existing)", 131, 0, 0.0, 57.19083969465652, 27, 94, 61.0, 71.8, 75.0, 93.04000000000002, 0.0029806587556191104, 0.004019814200693351, 0.0018570901231298755], "isController": false}, {"data": ["SELECT COUNT(*) AS count_before_cleanup", 1, 0, 0.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.014639825837742506, 0.0], "isController": false}, {"data": ["06 - Add to Cart", 135, 0, 0.0, 321612.074074074, 3725, 42462486, 4973.0, 5962.2, 6078.0, 2.7278765639999423E7, 0.003068557367759668, 0.0034221606581850985, 0.0015702383405332677], "isController": true}, {"data": ["11 - Save Payment Methods", 128, 0, 0.0, 679786.4609374999, 9935, 42470216, 12044.5, 13442.9, 13744.5, 4.247012813E7, 0.0029129212681530178, 0.005038630186143407, 0.0028839858472306606], "isController": true}, {"data": ["10 - Save Shipping Address ", 130, 0, 0.0, 676087.1230769235, 0, 42474683, 16601.5, 18877.7, 19737.149999999998, 4.247388909E7, 0.002957910279163704, 0.005564946450618018, 0.003073475869322436], "isController": true}, {"data": ["Get confirm ", 127, 0, 0.0, 48.5748031496063, 27, 70, 50.0, 59.0, 64.6, 69.72, 0.002891096295292296, 0.0012253279220281802, 0.0013664947333217492], "isController": false}, {"data": ["01 - Login", 139, 0, 0.0, 6084.107913669068, 4741, 7293, 6015.0, 6915.0, 7052.0, 7282.599999999999, 0.003155792747057422, 0.0030109467908936535, 0.0017843789067834446], "isController": true}, {"data": ["Logout-1", 127, 0, 0.0, 123.73228346456698, 91, 188, 120.0, 149.60000000000002, 169.79999999999995, 186.04, 0.002891149605996636, 0.06483064184853003, 0.0013044053886430134], "isController": false}, {"data": ["POST Add to Cart", 135, 0, 0.0, 64.19999999999997, 31, 95, 67.0, 78.4, 81.0, 93.19999999999993, 0.00306885905957883, 0.003422497115272484, 0.0015703927218938543], "isController": false}, {"data": ["Logout-0", 127, 0, 0.0, 29.61417322834647, 15, 59, 30.0, 35.0, 40.599999999999994, 57.879999999999995, 0.0028911553978952617, 0.0014992221838695157, 0.00126205709263592], "isController": false}, {"data": ["SELECT COUNT(*) AS count_after_cleanup", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 5.37109375, 0.0], "isController": false}, {"data": ["09 - Save Payment Address", 131, 0, 0.0, 338159.8167938933, 9723, 42468017, 11957.0, 13225.4, 13556.8, 2.897195460000029E7, 0.002979828675318982, 0.0041633056279592, 0.002013845628929123], "isController": true}, {"data": ["GET Cart", 133, 0, 0.0, 148.35338345864656, 103, 309, 145.0, 176.8, 195.3, 281.7999999999997, 0.0030259712514529784, 0.17580479263934767, 0.0013179523224101837], "isController": false}, {"data": ["POST Save Shipping Method", 129, 0, 0.0, 35.775193798449614, 19, 75, 37.0, 42.0, 44.5, 70.79999999999984, 0.002936440873863862, 0.002474754369281751, 0.00153130803383135], "isController": false}, {"data": ["GET Home", 138, 0, 0.0, 143.94202898550728, 103, 238, 142.0, 167.0, 182.04999999999998, 226.68999999999957, 0.0031367915945441373, 0.10898819154520104, 0.0014060423260700771], "isController": false}, {"data": ["00 - Register", 141, 0, 0.0, 915535.4822695034, 5733, 42468731, 12374.0, 13568.6, 14022.0, 4.246871546E7, 0.0032006698797760295, 0.0882876713084779, 0.003338531180074727], "isController": true}, {"data": ["GET Checkout", 133, 0, 0.0, 160.30827067669173, 113, 223, 157.0, 194.60000000000008, 211.6, 221.29999999999998, 0.0030259987900555212, 0.1967815287388547, 0.0013741107786873217], "isController": false}, {"data": ["GET Set Shipping Address", 15, 0, 0.0, 55.266666666666666, 28, 68, 57.0, 67.4, 68.0, 68.0, 3.4869842732824895E-4, 1.477882006449805E-4, 1.5596082003548634E-4], "isController": false}, {"data": ["Search Product", 136, 0, 0.0, 171.0441176470588, 110, 263, 170.5, 204.0, 225.90000000000003, 262.63, 0.003091667954861648, 0.10738051630428606, 0.0015005458726232803], "isController": false}, {"data": ["Logout", 127, 0, 0.0, 153.7874015748031, 110, 220, 151.0, 184.8, 198.0, 219.72, 0.00289114723659025, 0.06632980666915503, 0.0025664578496684934], "isController": false}, {"data": ["07 - View Cart", 135, 0, 0.0, 322290.9703703704, 0, 42462467, 5853.0, 6941.0, 7116.599999999999, 2.7278809279999424E7, 0.003068863315078446, 0.17565532937013126, 0.0013168318440670086], "isController": true}, {"data": ["GET payment_address (extract address_id)", 15, 0, 0.0, 60.66666666666667, 36, 72, 64.0, 72.0, 72.0, 72.0, 3.486867550220307E-4, 1.4778325359332163E-4, 1.607228011429673E-4], "isController": false}, {"data": ["Cleanup all load test data", 1, 0, 0.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 0.24414062500000003, 0.0], "isController": false}, {"data": ["GET Category ", 15, 0, 0.0, 183.13333333333335, 151, 231, 177.0, 230.4, 231.0, 231.0, 3.487104814257386E-4, 0.013273246749373198, 1.607337375321764E-4], "isController": false}, {"data": ["04 - Search", 137, 0, 0.0, 317640.3138686132, 0, 42462071, 5824.0, 6891.8, 7076.499999999998, 2.6435264720000193E7, 0.0031141178487210193, 0.10737076025214762, 0.0015004095405932877], "isController": true}, {"data": ["POST Save Payment (auto)", 127, 0, 0.0, 36.118110236220495, 19, 61, 37.0, 44.0, 46.599999999999994, 60.44, 0.002890979939990996, 0.002433617879172108, 0.001507600867143742], "isController": false}, {"data": ["Get Registration Page", 141, 0, 0.0, 152.02127659574472, 95, 222, 153.0, 178.79999999999998, 194.8, 215.2800000000002, 0.003201584280139442, 0.08530158585453554, 0.0012193533879437328], "isController": false}, {"data": ["08 - Checkout Page", 133, 0, 0.0, 328511.2030075189, 3748, 42462312, 5053.0, 6236.6, 6494.7, 2.8121682179999854E7, 0.003025718470500678, 0.19676329948155338, 0.0013739834851394682], "isController": true}, {"data": ["03 - Browse Category", 15, 0, 0.0, 5751.733333333334, 4442, 6979, 5845.0, 6955.6, 6979.0, 6979.0, 3.486685996543904E-4, 0.0132716525699177, 1.6071443265319556E-4], "isController": true}, {"data": ["Post extension/payment/cod/confirm", 127, 0, 0.0, 54.44881889763777, 29, 84, 56.0, 66.0, 69.6, 82.88, 0.0028911613214519503, 0.002642702145389673, 0.001518989053653466], "isController": false}, {"data": ["13 - Logout", 127, 0, 0.0, 341336.74015748024, 3622, 42462083, 4897.0, 5663.8, 5840.4, 3.065246671999995E7, 0.002890918409723538, 0.06632455683558114, 0.002566254721131539], "isController": true}, {"data": ["02 - Home", 139, 0, 0.0, 6738.496402877701, 0, 285245, 4682.0, 5623.0, 5873.0, 173566.9999999984, 0.0031563039644245034, 0.10887718600730523, 0.0014046102582240395], "isController": true}, {"data": ["GET Shipping Methods", 129, 0, 0.0, 38.41085271317831, 20, 66, 40.0, 47.0, 47.5, 63.59999999999991, 0.0029364673437401586, 0.0029479379193016434, 0.0013908072868300556], "isController": false}, {"data": ["Submit Registration", 139, 0, 0.0, 204.12949640287778, 170, 363, 204.0, 220.0, 223.0, 317.39999999999935, 0.0031561794053208505, 0.0030113157021469444, 0.0021201367291545535], "isController": false}, {"data": ["GET Payment Methods", 128, 0, 0.0, 39.10156250000001, 21, 79, 41.0, 47.0, 50.0, 74.0699999999999, 0.0029136944138240957, 0.002606390706116086, 0.0013771758752840453], "isController": false}, {"data": ["GET Product", 136, 0, 0.0, 170.22058823529412, 117, 269, 168.5, 202.2, 238.90000000000003, 265.66999999999996, 0.003091605685881132, 0.10737835356385754, 0.0014401327267239258], "isController": false}, {"data": ["05 - Product Page", 136, 0, 0.0, 320013.2500000001, 3855, 42464429, 5750.0, 6876.6, 7287.85, 2.6858695909999806E7, 0.0030912045117039025, 0.10736441989086684, 0.0014399458516433218], "isController": true}, {"data": ["12 - Confirm Order", 127, 0, 0.0, 345900.0551181104, 7157, 42465297, 9420.0, 10624.0, 10953.4, 3.0656588479999952E7, 0.002890435734780172, 0.003867086871727378, 0.002884790352485679], "isController": true}, {"data": ["Post Login", 139, 0, 0.0, 31.618705035971225, 18, 51, 33.0, 37.0, 39.0, 47.39999999999995, 0.0031562646175924284, 0.003011397003308401, 0.0017846457163925938], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2572, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
