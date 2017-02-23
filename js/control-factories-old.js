/* ========================================================================
 * control-dandlers.js v1.0.0
 * ========================================================================
 * Copyright 2016 A. D.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
(function($){"use strict";
	

	// Helpers
	controlManager.helpers = {};

	// inherit is a copy of google closure code
	var inherits = controlManager.helpers.inherits = function(childCtor, parentCtor) {
		  /** @constructor */
		  function tempCtor() {}
		  tempCtor.prototype = parentCtor.prototype;
		  childCtor.superClass_ = parentCtor.prototype;
		  childCtor.prototype = new tempCtor();
		  /** @override */
		  childCtor.prototype.constructor = childCtor;
	  	childCtor.base = function(me, methodName, var_args) {
	    	var args = new Array(arguments.length - 2);
	    	for (var i = 2; i < arguments.length; i++) {
	      		args[i - 2] = arguments[i];
	    	}
	    	return parentCtor.prototype[methodName].apply(me, args);
	  	};
	},
	creadeDiv = controlManager.helpers.createDiv = function(){
		return $('<div />');
	};
	

	/*
	 **** CONTROLS ****

	 ----- 1 -----
	 Text ad-text
	 TexArea ad-textarea
	 DatePicker ad-date
	 
	 ----- 2 -----
	 DropDown ad-select
	 Edtitable DropDwn ad-selectedit

	 ----- 3 -----
	 NamePicker ad-namepicker

	*/

	//////////////////////
	// GroupBuilder
	//////////////////////
	var GroupBuilder = window.GroupBuilder = function(){
		ControlBuilder.call(this);
	}
	inherits(GroupBuilder, ControlBuilder);
	var grpProt = GroupBuilder.prototype; 
	
	grpProt.renderCont = function(){
		this.cont = creadeDiv().addClass('form-group');
	};
	grpProt.renderLabel = function(){
		this.label = $('<label />').addClass('control-label');
	};
	grpProt.renderControlCont = function(){
		this.contrCont = creadeDiv();
	};
	grpProt.assemble = function(){
		this.label.appendTo(this.cont);
		if(this.state === 'view'){
			this.contrCont.append(this.static);
		} else {
			this.contrCont.append(this.control);
		}
		if(this.attr['hide'] || this.attr['hide'] === ''){
			this.cont.hide();
		}
		this.contrCont.appendTo(this.cont);
	};
	
	grpProt.render = function(state, htmlControl, model){
		GroupBuilder.base(this, 'render', state, htmlControl, model);
		this.renderCont();
		this.renderLabel();
		this.renderControlCont();
		
		if(this.state === 'view'){
			this.renderStatic();
		} else {
			this.renderControl();
		}		
		this.assemble();

		htmlControl.replaceWith(this.cont);
	};

	grpProt.hide = function(){
		this.cont.hide();
	};

	grpProt.show = function(){
		this.cont.show();
	};


	//////////////////////
	// TextControlBuilder
	//////////////////////
	var TextControlBuilder = function(){
		GroupBuilder.call(this);
	};
	inherits(TextControlBuilder, GroupBuilder);
	var prot = TextControlBuilder.prototype; 
	
	prot.renderControl = function(){
		var val = '';
		if(this.state === 'edit' && this.model && this.model[this.id]){
			val = this.model[this.id];
		}
		this.control = $('<input />')
			.attr('type','text')
			.addClass('form-control input-sm')
			.val(val);
		};

	prot.renderStatic = function(){
		var val = '';
		if(this.model && this.model[this.id]){
			val = this.model[this.id];
		}
		this.static = $('<p />')
			.text(val)
			.addClass('form-control-static');
	};

	// Get value of the last 
	// rendered controls
	prot.getLRVal = function(){
		if(this.lastRndr.prop("tagName") === 'P'){
			return this.lastRndr.text();
		} else {
			return this.lastRndr.val();
		}
	}
	
	prot.renderPartial = function(state){
		var id =  this.id,
			val = this.getLRVal();

		if(state === 'view'){
			this.renderStatic();
			this.static.attr('id', id);
			this.static.text(val);
			this.lastRndr.replaceWith(this.static);
			
			this.lastRndr = this.static;
		} 

		if(state === 'form' || state === 'edit'){
			this.renderControl();
			if(this.attr['validate'] || this.attr['validate'] === ''){
				this.label.text('*' + this.attr['label']);
				this.control.attr('data-val','true').attr('data-val-required', this.attr['label'] + 'is required.');
			} 
			this.control.attr('id', id);
			if(state === 'edit'){
				
				// Check model
				// 
				// TODO: This can be an inssue in the future
				// It needs to be indicated that a new model was applied
				// so control knows to use model data insted of previously enterd data in 
				// even of changing state
				// 
				if(this.model){
					val = this.model[this.id];
				}
				this.control.val(val);
		    } 
			this.lastRndr.replaceWith(this.control);
			
			this.lastRndr = this.control;
		}
	};
	
	prot.render = function(state, htmlControl, model){
		var attr = {},
			id,
			$this = this,
			width = 6,
			widthAdj;

		if(model){
			this.model = model;
		}	
	
		if($this.rendered){
			$this.renderPartial(state);
			return;
		}

		// Call base class' render method to render grup first
		TextControlBuilder.base($this, 'render', state, htmlControl);

		attr = $this.attr;
		id = $this.id;

		$this.cont.attr('id','con_' + id);
		$this.label.attr('for', id);		
		
		// Adding label column size
		if(attr['wlable']){
			$this.label.addClass('col-md-' + attr['wlable']);								
		} else {
			$this.label.addClass('col-md-' + width);
		}

		// Adding control column size
		if(attr['wcontrol']){
			$this.contrCont.addClass('col-md-' + attr['wcontrol']);
		} else {
			$this.contrCont.addClass('col-md-' + width);
		}

		// Redering different ways
		if(state === 'form' || state === 'edit'){
			//$this.renderControl();
			//$this.control.appendTo($this.contrCont);
			if(attr['validate'] || attr['validate'] === ''){
				$this.label.text('*' + attr['label']);
				$this.control.attr('data-val','true').attr('data-val-required', attr['label'] + 'is required.');
			} else {
				$this.label.text(attr['label']);
			}
			$this.control.attr('id', id).attr('name', id);
			$this.lastRndr = $this.control; 	
		}

		if(state === 'view'){
			//$this.renderStatic();
			//$this.static.appendTo($this.contrCont);
			$this.label.text(attr['label']);
			$this.static.attr('id', id).attr('name', id);
			
			$this.lastRndr = $this.static;
		}
		
		// Replace control
		// htmlControl.replaceWith($this.cont);
		
		$this.rendered = true;

		return {
			attributes: attr,
			id: id
		}
	};

	prot.getRawValue = function(){
		return this.control.val();
	};

	prot.setRawValue = function(value){
		this.control.val(value);
	};

	//////////////////////
	// TextAreaControlBuilder
	//////////////////////
	var TextAreaControlBuilder = function(){
		TextControlBuilder.call(this);
	};

	inherits(TextAreaControlBuilder, TextControlBuilder);
	TextAreaControlBuilder.prototype.renderControl = function(){
		var val = '';
		if(this.state === 'edit' && this.model && this.model[this.id]){
			val = this.model[this.id];
		}
		this.control = $('<textarea />')
			.addClass('form-control input-sm')
			.css("height", "100")
			.val(val);
	};

	//////////////////////
	// DatePickerControlBuilder
	//////////////////////
	var DatePickerControlBuilder = function(){
		TextControlBuilder.call(this);
	};

	inherits(DatePickerControlBuilder, TextControlBuilder);
	DatePickerControlBuilder.prototype.renderControl = function(){
		DatePickerControlBuilder.base(this, 'renderControl');
		this.control.addClass('datepicker').attr('data-date-format','mm/dd/yyyy');
	};


	//////////////////////
	// DatePickerControlBuilder
	//////////////////////
	var SelectControlBuilder = function(){
		TextControlBuilder.call(this);
	};

	inherits(SelectControlBuilder, TextControlBuilder);
	
	SelectControlBuilder.prototype._getData = function(par){
		var $this = this,
			control = $this.control,
			sourceName = $this.attr['source'],
			sourceHadler = controlManager.getDataSource(sourceName),
			sourceInstance = new sourceHadler(),
			val = '';
		
		if($this.state === 'edit' && $this.model && $this.model[$this.id]){
			val = $this.model[$this.id];
		}

		// Add empty option if specified
		if($this.attr['empty-option'] || $this.attr['empty-option'] === ''){
			$this.control.append($('<option />'));
		}

		sourceInstance.getData(par, function(data){
			$.each(data, function(){
				control.append($('<option />').text(this[0]).val(this[1]));		
			});
			control.val(val);
		});
	};

	SelectControlBuilder.prototype.renderControl = function(){
		var $this = this,
			lookup = $this.attr['lookup'],
			lookupVal = null;
		
		$this.control = $('<select />')
			.addClass('form-control input-sm');
		
		// If look up specified then
		// add lookup value and regieste event
		// to observe lookup control for change 
		if(lookup){
			lookup = $('#' + lookup);
			lookupVal = lookup.val();
			
			// Register event
			lookup.change(function(){
				$this.control.empty();
				$this._getData(lookup.val());
				$this.control.trigger('change');
			});
		}
		$this._getData(lookupVal);
	};


	//////////////////////
	// PPickerControlBuilder
	//////////////////////
	var PPickerControlBuilder = function(){
		TextControlBuilder.call(this);
	};

	inherits(PPickerControlBuilder, TextControlBuilder);

	var pprot = PPickerControlBuilder.prototype; 

	pprot.renderBtn = function(){
		this.btn = $('<span />')
			.addClass('glyphicon glyphicon glyphicon-user input-group-addon')
			.attr('data-autocomple-btn','');
	};

	pprot.renderResCon = function(){
		this.resCon = creadeDiv()
						.addClass('autocomplete')
						.attr('data-autocomplete-menu','')
						.css('display','none');
	};
	
	pprot.renderSubCon = function(){
		this.subCon = creadeDiv().addClass('input-group input-group-sm');
	};
	
	pprot.assemble = function(){
		this.label.appendTo(this.cont);
		if(this.state === 'view'){
			this.contrCont.append(this.static);
		} else {
			this.subCon
				.append(this.control)
				.append(this.btn)
				.append(this.resCon);
			this.contrCont.append(this.subCon);
		}
		this.contrCont.appendTo(this.cont);
	};
	
	pprot.render = function(state, htmlControl, model){
		this.renderBtn();
		this.renderResCon();
		this.renderSubCon();

		PPickerControlBuilder.base(this, 'render', state, htmlControl, model);

		return {
			attributes: this.attr,
			id: this.id
		}
	};
	
	pprot.renderControl = function(){
		var text = '',
			val = '';
		if(this.state === 'edit' && this.model && this.model[this.id]){
			val = this.model[this.id].value;
			text = this.model[this.id].text;
		}
		this.control = $('<input />')
			.attr('type','text')
			.addClass('form-control input-sm')
			.val(text)
			.attr('placeholder', 'Last Name, First Name')
			.attr('data-autocomplete-input','');
			
		if(text !== ''){
			this.control
				.attr('data-autocomplete-text', text)
				.attr('data-autocomplete-value',val);
		}	

	};

	pprot.renderPartial = function(state){
		var id =  this.id,
			val = this.getLRVal();

		if(state === 'view'){
			this.renderStatic();
			this.static.attr('id', id);
			this.static.text(val);
			this.lastRndr.replaceWith(this.static);
			
			this.lastRndr = this.static;
		} 

		if(state === 'form' || state === 'edit'){
			this.renderControl();
			if(this.attr['validate'] || this.attr['validate'] === ''){
				this.label.text('*' + this.attr['label']);
				this.control.attr('data-val','true').attr('data-val-required', this.attr['label'] + 'is required.');
			} 
			this.control.attr('id', id);
			if(state === 'edit'){
				
				// Check model
				// 
				// TODO: This can be an inssue in the future
				// It needs to be indicated that a new model was applied
				// so control knows to use model data insted of previously enterd data in 
				// even of changing state
				// 
				//if(this.model){
				//	val = this.model[this.id];
				//}
				//this.control.val(val);
		    } 
			this.lastRndr.replaceWith(this.control);
			
			this.lastRndr = this.control;
		}
	};
	
	pprot.getRawValue = function(){
		return {
			text: this.control.attr('data-autocomplete-text'),
			value: this.control.attr('data-autocomplete-value')  
		} 
	};
	
	pprot.setRawValue = function(value){
		this.control
			.val(value.text)
			.attr('data-autocomplete-value', value.value)
			.attr('data-autocomplete-text', value.text)
			.attr('data-autocomplete-dirty','true');
	};

	//////////////////////
	// StaticControlBuilder
	//////////////////////
	var StaticControlBuilder = function(){
		TextControlBuilder.call(this);
	};

	inherits(StaticControlBuilder, TextControlBuilder);
	StaticControlBuilder.prototype.renderControl = function(){
		var val = '';
		if(this.state === 'edit' && this.model && this.model[this.id]){
			val = this.model[this.id];
		}
		this.control = $('<p />')
			.addClass('form-control-static')
			.attr('id', this.id)
			.attr('data-value', val)
			.text(val);
	};

	StaticControlBuilder.prototype.getRawValue = function(){
		return this.control.attr('data-value');
	};
	
	StaticControlBuilder.prototype.setRawValue = function(value){
		this.control.attr('data-value', value);
	};


	// Register Controls
	controlManager.addControl('ad-text', TextControlBuilder);
	controlManager.addControl('ad-textarea', TextAreaControlBuilder);
	controlManager.addControl('ad-datepicker', DatePickerControlBuilder);
	controlManager.addControl('ad-select', SelectControlBuilder);
	controlManager.addControl('ad-p-picker', PPickerControlBuilder);
	controlManager.addControl('ad-static', StaticControlBuilder);

})(jQuery);
