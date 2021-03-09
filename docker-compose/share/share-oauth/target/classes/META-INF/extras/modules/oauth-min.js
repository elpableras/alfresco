if(typeof Extras=="undefined"||!Extras){var Extras={}
}(function(){var r=Alfresco.util.encodeHTML,l=Alfresco.util.combinePaths;
var v="org.alfresco.share.oauth.",t="data";
Extras.OAuthHelper=function a(){return this
};
Extras.OAuthHelper.prototype={options:{providerId:"",endpointId:"",connectorId:"",requestTokenPath:"/oauth/request_token",accessTokenPath:"/oauth/access_token",authorizationUrl:"",requestTokenCallbackUri:null,addTimestamps:false,storeType:"keystore"},authData:{},setOptions:function q(x){this.options=YAHOO.lang.merge(this.options,x);
return this
},init:function d(x){this.preferences=new Alfresco.service.Preferences();
this.loadCredentials(x)
},hasToken:function c(){return this.authData.oauth_token!==null&&this.authData.oauth_token!==""&&this.authData.oauth_token_secret!==null&&this.authData.oauth_token_secret!==""
},isAuthorized:function o(){return this.authData.oauth_token&&this.authData.oauth_token_secret&&!this.authData.oauth_callback_confirmed
},requestToken:function k(A){var y=this._buildUrl(this.options.requestTokenPath),x={};
if(this.options.connectorId!==null&&this.options.connectorId!==""){x.oauth_callback=window.location.protocol+"//"+window.location.host+Alfresco.constants.URL_SERVICECONTEXT+"extras/oauth/auth-return?rp="+window.location.pathname.replace(Alfresco.constants.URL_CONTEXT,"")+"&pid="+this.options.providerId+"&eid="+this.options.endpointId+"&cid="+this.options.connectorId
}else{if(this.options.requestTokenCallbackUri!==null&&!x.oauth_callback){x.oauth_callback=this.options.requestTokenCallbackUri
}}var B=this._buildAuthData(x);
var z={fn:A.requestTokenHandler&&A.requestTokenHandler.fn?A.requestTokenHandler.fn:this.onRequestTokenGranted,scope:A.requestTokenHandler&&A.requestTokenHandler.scope?A.requestTokenHandler.scope:this};
var C={success:this.requestTokenSuccess,failure:this.requestTokenFailure,scope:this,argument:{successCallback:A.successCallback,failureCallback:A.failureCallback,requestTokenHandler:z}};
YAHOO.util.Connect.initHeader("X-OAuth-Data",B);
if(Alfresco.util.CSRFPolicy&&Alfresco.util.CSRFPolicy.isFilterEnabled()){YAHOO.util.Connect.initHeader(Alfresco.util.CSRFPolicy.getHeader(),Alfresco.util.CSRFPolicy.getToken())
}YAHOO.util.Connect.asyncRequest("POST",y,C,"")
},requestTokenSuccess:function h(C){YAHOO.util.Connect.resetDefaultHeaders();
var x=this._unpackAuthData(C.responseText);
if(x.oauth_token&&x.oauth_token_secret){this.authData=x;
var A={successCallback:C.argument.successCallback,failureCallback:C.argument.failureCallback};
var B=C.argument.requestTokenHandler;
if(B&&B.fn&&typeof(B.fn)=="function"){var z=this;
B.fn.call(B.scope,{authToken:x.oauth_token,authParams:x,onComplete:function y(D){z.requestAccessToken.apply(z,[x,D,A])
}})
}}else{Alfresco.util.PopupManager.displayMessage({text:"Request token fail. Required parameters not sent."})
}},onRequestTokenGranted:function e(B){Alfresco.util.assertNotEmpty(B);
Alfresco.util.assertNotEmpty(B.authParams);
Alfresco.util.assertNotEmpty(B.onComplete);
var z=B.authParams.oauth_token,A=B.authParams.oauth_callback_confirmed,y=B.onComplete,x=this.options.authorizationUrl+"?oauth_token="+z;
if(A=="true"){this.saveCredentials({successCallback:{fn:function(){window.location.href=x
},scope:this}})
}else{Alfresco.util.PopupManager.displayMessage({text:"Callback was not confirmed"})
}},requestTokenFailure:function m(x){Alfresco.util.PopupManager.displayMessage({text:"Request token fail"});
YAHOO.util.Connect.resetDefaultHeaders()
},requestAccessToken:function g(B,x,A){var z=this._buildUrl(this.options.accessTokenPath),y={oauth_token:B.oauth_token,oauth_verifier:x,oauth_token_secret:B.oauth_token_secret};
var C=this._buildAuthData(y);
var D={success:this.requestAccessTokenSuccess,failure:this.requestAccessTokenFailure,scope:this,argument:{successCallback:A.successCallback,failureCallback:A.failureCallback}};
YAHOO.util.Connect.initHeader("X-OAuth-Data",C);
if(Alfresco.util.CSRFPolicy&&Alfresco.util.CSRFPolicy.isFilterEnabled()){YAHOO.util.Connect.initHeader(Alfresco.util.CSRFPolicy.getHeader(),Alfresco.util.CSRFPolicy.getToken())
}YAHOO.util.Connect.asyncRequest("POST",z,D,"")
},requestAccessTokenSuccess:function w(z){YAHOO.util.Connect.resetDefaultHeaders();
var y=this._unpackAuthData(z.responseText);
if(y.oauth_token&&y.oauth_token_secret){this.authData=y;
this.saveCredentials();
var x=z.argument.successCallback;
if(x&&x.fn&&typeof(x.fn)=="function"){x.fn.call(x.scope)
}}else{Alfresco.util.PopupManager.displayMessage({text:"Request access token fail. Required parameters not sent."})
}},requestAccessTokenFailure:function p(x){YAHOO.util.Connect.resetDefaultHeaders();
Alfresco.util.PopupManager.displayMessage({text:"Request access token fail"})
},clearCredentials:function b(){this.authData=""
},loadCredentials:function u(A){var x={fn:function(G){var E=G.json;
if(E!==null&&E.org){var D=E.org.alfresco.share.oauth[this.options.providerId].data;
if(D!==null&&D.length>0){var F=this._unpackAuthData(D);
if(!YAHOO.lang.isUndefined(F.oauth_token)&&!YAHOO.lang.isUndefined(F.oauth_token_secret)){this.authData=F
}}}var C=A?A.successCallback:null;
if(C&&C.fn&&typeof(C.fn)=="function"){C.fn.call(C.scope,this)
}},scope:this},B={fn:function(C){var D=A?A.failureCallback:null;
if(D&&D.fn&&typeof(D.fn)=="function"){D.fn.call(D.scope)
}},scope:this};
var z=v+this.options.providerId+"."+t;
if(this.options.storeType=="preferences"){this.preferences.request(z,{successCallback:x,failureCallback:B})
}else{if(this.options.storeType=="keystore"){var y=Alfresco.constants.PROXY_URI+"extras/slingshot/tokenstore/usertoken?filter="+z;
Alfresco.util.Ajax.jsonRequest({method:Alfresco.util.Ajax.GET,url:y,dataObj:null,successCallback:x,failureCallback:B})
}else{throw"Unsupported store type"
}}},saveCredentials:function u(C){var x={fn:function(F){var E=C?C.successCallback:null;
if(E&&E.fn&&typeof(E.fn)=="function"){E.fn.call(E.scope)
}},scope:this},D={fn:function(E){var F=C?C.failureCallback:null;
if(F&&F.fn&&typeof(F.fn)=="function"){F.fn.call(F.scope)
}},scope:this};
var A=v+this.options.providerId+"."+t,B=this._packAuthData(this.authData);
if(this.options.storeType=="preferences"){this.preferences.set(A,B,{successCallback:x,failureCallback:D})
}else{if(this.options.storeType=="keystore"){var z=Alfresco.constants.PROXY_URI+"extras/slingshot/tokenstore/usertoken",y=Alfresco.util.dotNotationToObject(A,B);
Alfresco.util.Ajax.jsonRequest({method:Alfresco.util.Ajax.POST,url:z,dataObj:y,successCallback:x,failureCallback:D})
}else{throw"Unsupported store type"
}}},request:function j(C){var z=this._buildUrl(C.url),D=this._buildAuthData();
C.method=C.method||Alfresco.util.Ajax.GET;
var B=function(J,G){var I="",H=true,F;
G=G;
for(F in J){if(J.hasOwnProperty(F)){if(H){H=false
}else{I+="&"
}I+=encodeURIComponent(F)+"="+(YAHOO.lang.isUndefined(G)?encodeURIComponent(J[F]):encodeURIComponent(""+J[F]).replace(/%20/g,G).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A"))
}}return I
};
if(YAHOO.lang.isObject(C.dataObj)){if(C.method.toUpperCase()==Alfresco.util.Ajax.GET){z=z+=(z.indexOf("?")==-1?"?":"&")+B(C.dataObj,true)
}else{var x=C.requestContentType||Alfresco.util.Ajax.FORM;
if(!YAHOO.lang.isValue(C.dataStr)){if((new RegExp("^\\s*"+Alfresco.util.Ajax.FORM)).test(x)){C.dataStr=B(C.dataObj,"+")
}else{if((new RegExp("^\\s*"+Alfresco.util.Ajax.JSON)).test(x)){C.dataStr=YAHOO.lang.JSON.stringify(C.dataObj||{})
}}}}}var E={success:function A(H){var G=H;
var I=H.getResponseHeader["Content-Type"]||H.getResponseHeader["content-type"];
var F=null;
if((new RegExp("^\\s*"+Alfresco.util.Ajax.JSON)).test(I)){G.json=Alfresco.util.parseJSON(H.responseText)
}C.successCallback.fn.call(C.successCallback.scope,G)
},failure:function y(F){C.failureCallback.fn.call(C.failureCallback.scope,F)
},scope:C.scope};
YAHOO.util.Connect.initHeader("X-OAuth-Data",D);
if(Alfresco.util.CSRFPolicy&&Alfresco.util.CSRFPolicy.isFilterEnabled()){YAHOO.util.Connect.initHeader(Alfresco.util.CSRFPolicy.getHeader(),Alfresco.util.CSRFPolicy.getToken())
}if(typeof C.requestContentType!="undefined"){YAHOO.util.Connect.setDefaultPostHeader(C.requestContentType);
YAHOO.util.Connect.setDefaultXhrHeader(C.requestContentType);
YAHOO.util.Connect.initHeader("Content-Type",C.requestContentType)
}YAHOO.util.Connect.asyncRequest(C.method,z,E,C.dataStr||"")
},_packAuthData:function f(B,A,z){var y=[],C,x;
z=z||"";
for(x in B){y.push(""+x+"="+z+B[x]+z)
}return y.join(A||"&")
},_unpackAuthData:function i(C,x){var A=C.split("&"),z={},B;
for(var y=0;
y<A.length;
y++){B=A[y].split("=");
if(B.length==2){z[B[0]]=B[1]
}}return z
},_buildUrl:function s(z,y,x){return Alfresco.constants.URL_CONTEXT+"proxy/"+this.options.endpointId+z
},_buildAuthData:function n(x){x=x||{};
if(this.options.addTimestamps){x.oauth_timestamp=Math.floor(Date.now()/1000)
}if(typeof x.oauth_token==="undefined"&&this.authData&&this.authData.oauth_token){x.oauth_token=this.authData.oauth_token
}if(typeof x.oauth_token_secret==="undefined"&&this.authData&&this.authData.oauth_token_secret){x.oauth_token_secret=this.authData.oauth_token_secret
}return this._packAuthData(x,",",'"')
}}
})();