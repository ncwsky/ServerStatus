// serverstatus.js
let error = 0;
let d = 0;
let server_status = [];

function timeSince(date) {
	if (date == 0)
		return "从未.";

	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);

	if (interval > 1)
		return interval + " 年前.";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1)
		return interval + " 月前.";
	interval = Math.floor(seconds / 86400);
	if (interval > 1)
		return interval + " 日前.";
	interval = Math.floor(seconds / 3600);
	if (interval > 1)
		return interval + " 小时前.";
	interval = Math.floor(seconds / 60);
	if (interval > 1)
		return interval + " 分钟前.";
	/*if(Math.floor(seconds) >= 5)
		return Math.floor(seconds) + " seconds";*/
	else
		return "几秒前.";
}

function toByte(bytes){
	let v = '-';
	if (bytes >= 1099511627776) {
		v = (bytes / 1099511627776).toFixed(2) + 'T';
	} else if (bytes >= 1073741824) {
		v = (bytes / 1073741824).toFixed(2) + 'G';
	} else if (bytes >= 1048576) {
		v = (bytes / 1048576).toFixed(2) + 'M';
	} else if (bytes >= 1024) {
		v = (bytes / 1024).toFixed(2) + 'K';
	} else {
		v = bytes + 'B';
	}
	return v;
}

function uptime() {
	$.getJSON("json/stats.json", function(result) {
		$("#loading-notice").remove();

		for (var i = 0; i < result.servers.length; i++) {
			var TableRow = $("#servers tr#r" + i);
			var ExpandRow = $("#servers #rt" + i);
			var hack; // fuck CSS for making me do this
			if(i%2) hack="odd"; else hack="even";
			if (!TableRow.length) {
				$("#servers").append(
					"<tr id=\"r" + i + "\" data-toggle=\"collapse\" data-target=\"#rt" + i + "\" class=\"accordion-toggle " + hack + "\">" +
						"<td id=\"online4\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>加载中</small></div></div></td>" +
						"<td id=\"name\">加载中</td>" +
						"<td id=\"type\">加载中</td>" +
						"<!-- td id=\"host\">加载中</td -->" +
						"<td id=\"location\">加载中</td>" +
						"<td id=\"uptime\">加载中</td>" +
						"<td id=\"load\">加载中</td>" +
						"<td id=\"network\">加载中</td>" +
						"<td id=\"traffic\">加载中</td>" +
						"<td id=\"cpu\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>加载中</small></div></div></td>" +
						"<td id=\"memory\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>加载中</small></div></div></td>" +
						"<td id=\"hdd\"><div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>加载中</small></div></div></td>" +
					"</tr>" +
					"<tr class=\"" + hack + "\"><td colspan=\"12\"><div class=\"accordian-body collapse\" id=\"rt" + i + "\">" +
						"<div id=\"expand_mem\">加载中</div>" +
						"<div id=\"expand_swap\">加载中</div>" +
						"<div id=\"expand_hdd\">加载中</div>" +
						"<div id=\"expand_custom\">加载中</div>" +
					"</div></td></tr>"
				);
				TableRow = $("#servers tr#r" + i);
				ExpandRow = $("#servers #rt" + i);
				server_status[i] = true;
			}
			TableRow = TableRow[0];
			if(error) {
				TableRow.setAttribute("data-target", "#rt" + i);
				server_status[i] = true;
			}

			// Online4
			if (result.servers[i].online4) {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>运行中</small>";
			} else {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>维护中</small>";
			}

			// Name
			TableRow.children["name"].innerHTML = result.servers[i].name;

			// Type
			TableRow.children["type"].innerHTML = result.servers[i].type;

			// Host
			//TableRow.children["host"].innerHTML = result.servers[i].host;

			// Location
			TableRow.children["location"].innerHTML = result.servers[i].location;
			if (!result.servers[i].online4 && !result.servers[i].online6) {
				if (server_status[i]) {
					TableRow.children["uptime"].innerHTML = "–";
					TableRow.children["load"].innerHTML = "–";
					TableRow.children["network"].innerHTML = "–";
					TableRow.children["traffic"].innerHTML = "–";
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["cpu"].children[0].children[0].style.width = "100%";
					TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>维护中</small>";
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["memory"].children[0].children[0].style.width = "100%";
					TableRow.children["memory"].children[0].children[0].innerHTML = "<small>维护中</small>";
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["hdd"].children[0].children[0].style.width = "100%";
					TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>维护中</small>";
					if(ExpandRow.hasClass("in")) {
						ExpandRow.collapse("hide");
					}
					TableRow.setAttribute("data-target", "");
					server_status[i] = false;
				}
			} else {
				if (!server_status[i]) {
					TableRow.setAttribute("data-target", "#rt" + i);
					server_status[i] = true;
				}

				// Uptime
				TableRow.children["uptime"].innerHTML = result.servers[i].uptime;

				// Load
				if(result.servers[i].load == -1) {
					TableRow.children["load"].innerHTML = "–";
				} else {
					TableRow.children["load"].innerHTML = result.servers[i].load;
				}

				// Network
				var netstr = "";
				if(result.servers[i].network_rx < 1000)
					netstr += result.servers[i].network_rx.toFixed(0) + "B";
				else if(result.servers[i].network_rx < 1000*1000)
					netstr += (result.servers[i].network_rx/1000).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_rx/1000/1000).toFixed(1) + "M";
				netstr += " | "
				if(result.servers[i].network_tx < 1000)
					netstr += result.servers[i].network_tx.toFixed(0) + "B";
				else if(result.servers[i].network_tx < 1000*1000)
					netstr += (result.servers[i].network_tx/1000).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_tx/1000/1000).toFixed(1) + "M";
				TableRow.children["network"].innerHTML = netstr;

				//Traffic
				var trafficstr = "";
				if(result.servers[i].network_in < 1024)
					trafficstr += result.servers[i].network_in.toFixed(0) + "B";
				else if(result.servers[i].network_in < 1024*1024)
					trafficstr += (result.servers[i].network_in/1024).toFixed(0) + "K";
				else if(result.servers[i].network_in < 1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_in < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_in/1024/1024/1024/1024).toFixed(2) + "T";
				trafficstr += " | "
				if(result.servers[i].network_out < 1024)
					trafficstr += result.servers[i].network_out.toFixed(0) + "B";
				else if(result.servers[i].network_out < 1024*1024)
					trafficstr += (result.servers[i].network_out/1024).toFixed(0) + "K";
				else if(result.servers[i].network_out < 1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_out < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_out/1024/1024/1024/1024).toFixed(2) + "T";
				TableRow.children["traffic"].innerHTML = trafficstr;

				// CPU
				if (result.servers[i].cpu >= 90)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (result.servers[i].cpu >= 80)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["cpu"].children[0].children[0].style.width = result.servers[i].cpu + "%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = result.servers[i].cpu + "%";

				// Memory
				var Mem = ((result.servers[i].memory_used/result.servers[i].memory_total)*100.0).toFixed(0);
				if (Mem >= 90)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (Mem >= 80)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["memory"].children[0].children[0].style.width = Mem + "%";
				TableRow.children["memory"].children[0].children[0].innerHTML = Mem + "%";
				ExpandRow[0].children["expand_mem"].innerHTML = "内存信息: " + toByte(result.servers[i].memory_used*1024) + " / " + toByte(result.servers[i].memory_total*1024);
				// Swap
				ExpandRow[0].children["expand_swap"].innerHTML = "交换分区: " + toByte(result.servers[i].swap_used*1024) + " / " + toByte(result.servers[i].swap_total*1024);

				// HDD
				var HDD = ((result.servers[i].hdd_used/result.servers[i].hdd_total)*100.0).toFixed(0);
				if (HDD >= 90)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (HDD >= 80)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["hdd"].children[0].children[0].style.width = HDD + "%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = HDD + "%";
				ExpandRow[0].children["expand_hdd"].innerHTML = "硬盘信息: " + toByte(result.servers[i].hdd_used*1024*1024) + " / " + toByte(result.servers[i].hdd_total*1024*1024);

				// Custom
				if (result.servers[i].custom) {
					ExpandRow[0].children["expand_custom"].innerHTML = result.servers[i].custom
				} else {
					ExpandRow[0].children["expand_custom"].innerHTML = ""
				}
			}
		};

		d = new Date(result.updated*1000);
		error = 0;
	}).fail(function(update_error) {
		if (!error) {
			$("#servers > tr.accordion-toggle").each(function(i) {
				var TableRow = $("#servers tr#r" + i)[0];
				var ExpandRow = $("#servers #rt" + i);
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>错误</small>";
				//TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-error";
				//TableRow.children["online6"].children[0].children[0].innerHTML = "<small>错误</small>";
				TableRow.children["uptime"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>错误</small></div></div>";
				TableRow.children["load"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>错误</small></div></div>";
				TableRow.children["network"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>错误</small></div></div>";
				TableRow.children["traffic"].innerHTML = "<div class=\"progress progress-striped active\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>错误</small></div></div>";
				TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["cpu"].children[0].children[0].style.width = "100%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>错误</small>";
				TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["memory"].children[0].children[0].style.width = "100%";
				TableRow.children["memory"].children[0].children[0].innerHTML = "<small>错误</small>";
				TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["hdd"].children[0].children[0].style.width = "100%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>错误</small>";
				if(ExpandRow.hasClass("in")) {
					ExpandRow.collapse("hide");
				}
				TableRow.setAttribute("data-target", "");
				server_status[i] = false;
			});
		}
		error = 1;
		$("#updated").html("更新错误.");
	});

	if (!error)
		$("#updated").html("最后更新: " + timeSince(d));
}

uptime();
//setInterval(uptime, 2000);