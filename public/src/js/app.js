var app = {
    init: function(){
        this.initEvents();
        this.initAjax();
    },

    initEvents: function() {
    	// Add to cart click event
		document.addEventListener('click',function(e){
			var _this = e.target;
			var values = e.target.parentElement;
			var valuess = e.target.parentElement.parentElement;
			if(_this && _this.className== 'addtocart'){
				var	totalOff = parseInt(valuess.parentElement.getElementsByClassName('off')[0].innerHTML.split('%')[0]),
					getPercentage = (parseInt(values.getElementsByClassName('actual')[0].innerHTML.split('$')[1])*totalOff) / 100,
					newData = "";
				newData += '<ul class="itemslist" data-name="'+valuess.getElementsByTagName('h5')[0].innerHTML+'" data-actualprice="'+values.getElementsByClassName('actual')[0].innerHTML+'" data-discount="'+getPercentage+'" data-actualpricenochange="'+values.getElementsByClassName('actual')[0].innerHTML+'" data-discountnochange="'+getPercentage+'">';
				newData += '<li><img src="'+valuess.parentElement.getElementsByTagName('img')[0].src+'"> <span class="title">'+valuess.getElementsByTagName('h5')[0].innerHTML+'</span><span class="close"> X</span></li>';
				newData += '<li>';
				newData += '<span class="minus">-</span>';
				newData += '<span class="quantity">1</span>';
				newData += '<span class="plus">+</span>';
				newData += '</li>';
				newData += '<li>'+values.getElementsByClassName('actual')[0].innerHTML+'</li>';
				newData += '</ul>';
				document.getElementsByClassName('total-items')[0].innerHTML += newData;

				// top message added to cart
				app.addedtoCartMessage(document.getElementsByClassName('items')[0], valuess.getElementsByTagName('h5')[0]);
				// total items
				app.totalItems();
				// calculate total price
				app.totalPrice();
			}


		// Plus click
			if(_this && _this.className == 'plus'){
				values.querySelector('.quantity').innerHTML = parseInt(values.querySelector('.quantity').innerHTML) + 1;
				values.nextSibling.innerHTML = '$' + (parseInt(values.nextSibling.innerHTML.split('$')[1]) + parseInt(valuess.getAttribute('data-actualpricenochange').split('$')[1]));
				var actualpriceUpdated = '$' + (
					parseInt(
						valuess.getAttribute('data-actualprice').split('$')[1]
						) + parseInt(
						valuess.getAttribute('data-actualpricenochange').split('$')[1]
						)
					);
				valuess.setAttribute('data-actualprice', actualpriceUpdated);
				var discountUpdated = parseInt(valuess.getAttribute('data-discount')) + parseInt(valuess.getAttribute('data-discountnochange'));
				valuess.setAttribute('data-discount', discountUpdated);
				// total items
				app.totalItems();
				// calculate total price
				app.totalPrice();
			}


		// Minus click
			if(_this && _this.className == 'minus'){
				if(_this.nextSibling.innerHTML == 1) {
					valuess.remove();
				}
				values.querySelector('.quantity').innerHTML = parseInt(values.querySelector('.quantity').innerHTML) - 1;
				values.nextSibling.innerHTML = '$' + (parseInt(valuess.getAttribute('data-actualprice').split('$')[1]) - parseInt(valuess.getAttribute('data-actualpricenochange').split('$')[1]));
				var actualpriceUpdated = '$' + (
					parseInt(
						valuess.getAttribute('data-actualprice').split('$')[1]
						) - parseInt(
						valuess.getAttribute('data-actualpricenochange').split('$')[1]
						)
					);
				valuess.setAttribute('data-actualprice', actualpriceUpdated);
				var discountUpdated = parseInt(valuess.getAttribute('data-discount')) - parseInt(valuess.getAttribute('data-discountnochange'));
				valuess.setAttribute('data-discount', discountUpdated);
				// total items
				app.totalItems();
				// calculate total price
				app.totalPrice();
			}

			// Close click
			if(_this && _this.className == 'close'){
				_this.parentElement.parentElement.remove();
				// total items
				app.totalItems();
				// calculate total price
				app.totalPrice();
			}
		});
	},

	addedtoCartMessage: function(message, tag) {
		message.style.display = 'block';
		message.innerHTML = tag.innerHTML + ' is added to cart';
		setTimeout(function(){
			message.style.display = 'none';
		}, 1500);
	},

	totalItems: function() {
		var display = document.querySelectorAll('.total-quantity'),
		    totalNumber = document.getElementsByClassName('quantity'),
		    number = 0;
		for(var i=0; i<totalNumber.length; i++) {
			number += parseInt(totalNumber[i].innerHTML);
		}
		for(var i=0; i<display.length; i++) {
			display[i].innerHTML = '('+number+')';
		}		
	},

	totalPrice: function() {
		var totalAmount = document.querySelector('.total-amount'),
		    totalDiscount = document.querySelector('.total-discount'),
		    itemsList = document.getElementsByClassName('itemslist'),
		    totalOrderAmount = document.querySelector('.total-order-amount'),
		    number = 0,
		    number1 = 0;
		for(var i=0; i<itemsList.length; i++) {
			number += parseInt(itemsList[i].getAttribute('data-actualprice').split('$')[1]);
			number1 += parseInt(itemsList[i].getAttribute('data-discount'));
		}
		totalAmount.innerHTML = '$'+number;
		totalDiscount.innerHTML = '-$'+number1;
		totalOrderAmount.innerHTML = '$'+(number - number1);
			
	},

    initAjax: function() {
    	var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				var data = JSON.parse(this.responseText).items;
				for(var i=0; i<data.length; i++) {
					var newData = "";
					newData += '<div class="content">';
					newData += '<span class="off">'+data[i].discount+'% off</span>';
					newData += '<img src="'+data[i].image+'" alt="" width="100%">';
					newData += '<div class="details">';
					newData += '<h5>'+data[i].name+'</h5>';
					newData += '<div class="values">';
					newData += '<span class="discount"> $'+data[i].price.display+'</span>';
					newData += '<span class="actual"> $'+data[i].price.actual+'</span>';
					newData += '<button type="submit" class="addtocart">Add to cart</button>';
					newData += '</div>';
					newData += '</div>';
					document.getElementsByClassName('cart-container')[0].innerHTML += newData;
				}
			}
		};
		xmlhttp.open('GET', 'dist/js/cart.json');
		xmlhttp.send();
    }

}

app.init();