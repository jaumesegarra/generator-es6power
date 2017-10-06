<% if(lodash) { %>import _ from 'lodash';<% } %>
<% if(jquery) { %>import $ from 'jquery';<% } %>

import {start} from './game.js';

<% if(lodash) { %>_.times(3, (i)=>{
	console.log(i);
});<% } %>

<% if(jquery) { %>$(function () {
	$('h1').html("Hello $");
});<% } %>

start();