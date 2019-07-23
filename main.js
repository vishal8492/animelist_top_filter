// fork of https://greasyfork.org/en/scripts/17961-myanimelist-mal-search-filter
// Top Search Filter!
// version 1.2
// 2010-06-14
// Copyright (c) 2009, Bastvera <bastvera@gmail.com>, <vishal8492@gmail.com>
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html

// ==UserScript==
// @name           MyAnimeList(MAL) - Top Filter
// @include        *://myanimelist.net/anime.php?*
// @include        *://myanimelist.net/manga.php?*
// @include        *://myanimelist.net/topanime.php
// @include        *://myanimelist.net/topanime.php?*
// @include        *://myanimelist.net/topmanga.php?*
// @include        *://myanimelist.net/anime/genre/*
// @include        *://myanimelist.net/manga/genre/*
// @include        *://myanimelist.net/anime/producer/*
// @include        *://myanimelist.net/manga/magazine/*
// @exclude        *://myanimelist.net/anime.php
// @exclude        *://myanimelist.net/manga.php
// @exclude        *://myanimelist.net/anime.php?id=*
// @exclude        *://myanimelist.net/manga.php?id=*
// @description    This script hides search results that you already have on your list
// @version        1.4.1
// @author         Bastvera <bastvera@gmail.com>, Cpt_mathix <fixed script>
// @namespace      https://greasyfork.org/users/16080
// ==/UserScript==



//Anchor for checkbox
var	Anchor = document.evaluate(
	"//*[@id='content']/div[contains(@class,'breadcrumb')]",
	document,
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null);

var Anchor2 = document.evaluate(
	"//*[@id='content']/div[3]/h2",
	document,
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null);

var AnchorLink = Anchor.snapshotItem(0) || Anchor2.snapshotItem(0);

if(AnchorLink !== null){
	injectCSS();

	//Element Placing
	var newElement;
	newElement = document.createElement('BR');
	AnchorLink.appendChild(newElement);

	var checkbox1 = document.createElement('input');
	checkbox1.type = 'checkbox';
	checkbox1.className = 'filterbox';
	AnchorLink.appendChild(checkbox1);

	newElement = document.createElement('label');
	newElement.setAttribute('for','firstName');
	var url = document.location.href;
	if (/manga\/genre/.test(url)) {
		newElement.appendChild(document.createTextNode('Hide Search Results that you have on your list. (Show PTR:'));
	} else {
		newElement.appendChild(document.createTextNode('Hide Search Results that you have on your list. (Show PTW:'));
	}
	AnchorLink.appendChild(newElement);
	newElement.style.fontWeight="normal";
	newElement.style.fontSize="10px";

	var checkbox2 = document.createElement('input');
	checkbox2.type = 'checkbox';
	checkbox2.className = 'filterbox';
	AnchorLink.appendChild(checkbox2);

	newElement = document.createElement('label');
	newElement.setAttribute('for','firstName');
	newElement.appendChild(document.createTextNode(')'));
	AnchorLink.appendChild(newElement);
	newElement.style.fontWeight="normal";
	newElement.style.fontSize="10px";

	//Anime list entries search
	var allElements = document.evaluate(
		"//a[(contains(@class,'js-anime-watch-status') or contains(@class, 'button_edit')) and not(contains(@class,'notinmylist'))]",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	var ptwElements = document.evaluate(
		"//a[contains(@class,'plantowatch') or contains(@class,'plantoread')]",
		document,
		null,
		XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
		null);

	//Get or Set status of checkbox
	var activate = true;
	var checkboxmem1 = (localStorage.getItem('checkboxmem1_search') === "true"); //Get checkbox status
	if(checkboxmem1 === null){
		checkboxmem1 = false;
		localStorage.setItem('checkboxmem1_search', checkboxmem1);
		checkbox1.checked = checkboxmem1;
		activate = false;
	}
	var checkboxmem2 = (localStorage.getItem('checkboxmem2_search') === "true"); //Get checkbox status PTW
	if(checkboxmem2 === null){
		checkboxmem2 = false;
		localStorage.setItem('checkboxmem2_search', checkboxmem2);
		checkbox2.checked = checkboxmem2;
		activate = false;
	}

	if (activate) {
		checkbox1.checked = checkboxmem1;
		checkbox2.checked = checkboxmem2;
		if(checkbox1.checked === true) {
			HideDivs(checkboxmem2, allElements);
		}
	}

	//Listener 1
	checkbox1.addEventListener('change',function () {

		if(checkbox1.checked === true){
			checkbox2.disabled = false;
			HideDivs(checkbox2.checked, allElements);
		}

		if(checkbox1.checked === false){
			checkbox2.disabled = true;
			ShowDivs(checkbox2.checked, allElements);
		}

		localStorage.setItem('checkboxmem1_search', checkbox1.checked);

	},false);

	//Listener 2
	checkbox2.addEventListener('change',function () {

		if(checkbox2.checked === true && checkbox1.checked === true){
			ShowDivs(false, ptwElements);
		}

		if(checkbox2.checked === false && checkbox1.checked === true){
			HideDivs(false, ptwElements);
		}

		localStorage.setItem('checkboxmem2_search', checkbox2.checked);

	},false);
}

function HideDivs(showPTW, elements){
	for (var i = 0; i < elements.snapshotLength; i++){
		var EditLink = elements.snapshotItem(i);
		console.log(EditLink);
		var PTW = showPTW ? !EditLink.classList.contains("plantowatch") && !EditLink.classList.contains("plantoread") : true;
		if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && PTW)
			EditLink.parentNode.parentNode.parentNode.style.display="none";
		else if (PTW) {
			EditLink.parentNode.parentNode.style.display="none";
		}
	}
}

function ShowDivs(showPTW, elements){
	for (var i = 0; i < elements.snapshotLength; i++){
		var EditLink = elements.snapshotItem(i);
		var PTW = showPTW ? !EditLink.classList.contains("plantowatch") && !EditLink.classList.contains("plantoread") : true;
		if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && PTW)
			EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
		else if (PTW) {
			EditLink.parentNode.parentNode.removeAttribute('style');
		}
	}
}

function injectCSS() {
	var css = `
input.filterbox {
  width: 13px;
  height: 13px;
  padding: 0;
  margin: 6px 2px 0 2px;
  vertical-align: bottom;
}
`;

	var style = document.createElement("style");
	style.type = "text/css";
	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	document.documentElement.appendChild(style);
}
