(function(M, window) {
	define('cfcaUtils',function() {
				var CryptoAgent = "";
				function OnLoad() {
					try {
						var eDiv = document.createElement("div");
						if (navigator.appName.indexOf("Internet") >= 0
								|| navigator.appVersion.indexOf("Trident") >= 0) {
							if (window.navigator.cpuClass == "x86") {
								eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.Paperless.x86.cab\" classid=\"clsid:B64B695B-348D-400D-8D58-9AAB1DA5851A\" ></object>";
							} else {
								eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.Paperless.x64.cab\" classid=\"clsid:8BF7E683-630E-4B59-9E61-C996B671EBDF\" ></object>";
							}
						} else {
							eDiv.innerHTML = "<embed id=\"CryptoAgent\" type=\"application/npCryptoKit.Paperless.x86\" style=\"height: 0px; width: 0px\">";
						}
						document.body.appendChild(eDiv);
					} catch (e) {
						errorMsgInfo(e);
						return;
					}
					CryptoAgent = document.getElementById("CryptoAgent");
				}

				function SelectObjctById(id) {
					var obj;
					if (document.getElementById) {
						obj = document.getElementById(id);
						// errorMsgInfo("ID");
					} else if (document.all) {
						obj = document.all(id);
						// errorMsgInfo("ALL");
					} else {
						errorMsgInfo("The Internet Browser does't support Document all or Document getElementById");
					}
					return obj;
				}

				// Get version
				function GetVersion_OnClick() {
					var version = "";
					try {
						version = CryptoAgent.GetVersion();
						errorMsgInfo(version);
					} catch (e) {
						var strErrorDsc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(strErrorDsc);
					}
				}

				// Select certificate
				function SelectCertificateOnClick() {
					try {
						document.getElementById("SelectCertResult").value = "";

						var subjectDNFilter = "";
						var issuerDNFilter = "";
						var serialNumFilter = "";
						var cspName = "";
						var bSelectCertResult = "";
						subjectDNFilter = document
								.getElementById("SubjectDNFilter").value;
						issuerDNFilter = document
								.getElementById("IssuerDNFilter").value;
						serialNumFilter = document
								.getElementById("SerialNumFilter").value;
						cspName = document.getElementById("CSPNameFilter").value;

						bSelectCertResult = CryptoAgent.SelectCertificate(
								subjectDNFilter, issuerDNFilter,
								serialNumFilter, cspName);
						// Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
						if (!bSelectCertResult) {
							var errorDesc = CryptoAgent.GetLastErrorDesc();
							errorMsgInfo(errorDesc);
							return;
						}
						document.getElementById("SelectCertResult").value = bSelectCertResult;
					}

					catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}

				// Get certificate information
				function GetCertInfoOnClick() {
					try {
						var InfoTypeID = "";
						var InfoContent = "";

						document.getElementById("CertInfoContent").value = "";

						// certificate information identifier
//						InfoTypeID = GetSelectedItemValue("InfoTypeID");

						InfoContent = CryptoAgent.GetSignCertInfo('SubjectDN');
						// Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
						if (!InfoContent) {
							var errorDesc = CryptoAgent.GetLastErrorDesc();
							errorMsgInfo(errorDesc);
							return;
						}
						document.getElementById("CertInfoContent").value = InfoContent;
					} catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}

				// Sign P1 message
				function SignP1OnClick() {
					try {
//						var selectedAlg = GetSelectedItemValue("p1algorithm");
						var sourceHashData = "";
						var signature = "";

						document.getElementById("P1Signature").value = "";
						sourceHashData = document
								.getElementById("P1SourceData").value;

						signature = CryptoAgent.SignMsgPKCS1(sourceHashData,
								'SHA-1');
						if (!signature) {
							var errorDesc = CryptoAgent.GetLastErrorDesc();
							errorMsgInfo(errorDesc);
							return;
						}

						document.getElementById("P1Signature").value = signature;
					} catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}

				// Sign P7 message
				function SignP7OnClick() {
					try {
						var selectedAlg = "SHA-1";
						var sourceHashData = "";
						var signature = "";

						document.getElementById("Signature").value = "";
						sourceHashData = document
								.getElementById("txtToSign").value;
						
//						console.log(sourceHashData);
						signature = CryptoAgent.SignMsgPKCS7(sourceHashData,
								selectedAlg, true);
						if (!signature) {
							var errorDesc = CryptoAgent.GetLastErrorDesc();
							//errorMsgInfo(errorDesc);
							return;
						}
//						console.log(signature);
//						signature="MIIEWwYJKoZIhvcNAQcCoIIETDCCBEgCAQExCzAJBgUrDgMCGgUAMBMGCSqGSIb3DQEHAaAGBAQxMjM0oIIDODCCAzQwggIcoAMCAQICEBAAAAAAAAAAAAAAMAMFInMwDQYJKoZIhvcNAQEFBQAwKzELMAkGA1UEBhMCQ04xHDAaBgNVBAoME0NGQ0EgUlNBIFRFU1QgT0NBMjEwHhcNMTkwNDE3MDcyMDI5WhcNMjEwNDE3MDcyMDI5WjB1MQswCQYDVQQGEwJDTjEVMBMGA1UECgwMQ0ZDQSBURVNUIENBMQ0wCwYDVQQLDAR0Y2NiMRQwEgYDVQQLDAtFbnRlcnByaXNlczEqMCgGA1UEAwwhMDQxQDc0NTkyNzE3MC0xQHRvbmdiYW8xQDAwMDAwMDAyMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxJolCYttefdgEQkbeL8YX9i4eIvcGB6IT19amvB5qnQI7zNlIVAZDQiuE1OBSUmvCU+DR954ML5FkUH65yEPH2sRTPLqTXsKgvreN6BETooJuZ+z+QAW0ZxCBlmBgDAt3V3YhFAQg8aZkP3U8t/iwqMGHy0oXiLcs57F3FTb1TwIDAQABo4GNMIGKMB8GA1UdIwQYMBaAFM/fmfuGIhYTOSwHXo49dyu5ae+OMAsGA1UdDwQEAwIE8DAdBgNVHQ4EFgQU7mROz1RhqY9LTC055KiL+QunhCAwOwYDVR0lBDQwMgYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYBBQUHAwEGCCsGAQUFBwMIMA0GCSqGSIb3DQEBBQUAA4IBAQA9RiWOQhhmLlQAfj0lYiZYhl7JHjv2fg2s5HlitEU4Ru8j6+wF3IF0cT2882wehfqgOFTGGLef0P/qA3M8Kc6OzpdSwqqPIf4l4QgfVKhwBEHeqaqbVObd2Xdxn7pJPMcXMtxNB1SUVUVuC/WqTm0hPKTyR4viDFGZykjMXhH9QvB6rtmzT8HUxyjdUI5kCjyySDwo/B9mvwFQaGu0qz/UqxbTGs5azqA5vAvKV3HKNoVKJ63KY6ywJNj/t9M0lkDCGmnd83RWuP9OQ3wAp8brfNB2uzGf8FWa0I9cfcmjU9aCko3jRAC7JBVTz40PlkH96uH+U2i/ZR+Muk0xi8OlMYHkMIHhAgEBMD8wKzELMAkGA1UEBhMCQ04xHDAaBgNVBAoME0NGQ0EgUlNBIFRFU1QgT0NBMjECEBAAAAAAAAAAAAAAMAMFInMwCQYFKw4DAhoFADANBgkqhkiG9w0BAQEFAASBgHbK2ijm0V0BWdCEnkSDjCDnJkIBzhddBQyOHKJ+dI4aX4oR6RYmRMSbnJcwuXWfEfPytQ/TYn9tgyob0W3qY1U3uefV3MyPFNzShUHF92jvA8qvA24pdHCKMUnnI7GbhdtQQ/SlZABc9duTQoOIUJRD1dfVt5gRBZkOcCVr6N6O"
						
						document.getElementById("Signature").value = signature;
					} catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}

				// Sign hash message
				function SignOnClick() {
					try {
						var sourceHashData = "";
						var signature = "";

						document.getElementById("p7SignedData").value = "";
						sourceHashData = document
								.getElementById("txtToSign").value;

						signature = CryptoAgent.SignHashMsgPKCS7Detached(
								sourceHashData, "SHA-256");
						if (!signature) {
							var errorDesc = CryptoAgent.GetLastErrorDesc();
							//errorMsgInfo(errorDesc);
							return;
						}

						document.getElementById("p7SignedData").value = signature;
					} catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}

				function GetSelectedItemValue(itemName) {
					var ele = document.getElementsByName(itemName);
					for (i = 0; i < ele.length; i++) {
						if (ele[i].checked) {
							return ele[i].value;
						}
					}
				}

				function GetSelectedItemIndex(itemName) {
					var ele = document.getElementsByName(itemName);
					for (i = 0; i < ele.length; i++) {
						if (ele[i].checked) {
							return i;
						}
					}
				}

				function GetSealOnClick() {
					try {
						var p11name = document.getElementById("P11Name").value;

						var sealImage = CryptoAgent.GetSealImage(p11name);

						document.getElementById("SealImage").value = sealImage;
					} catch (e) {
						var errorDesc = CryptoAgent.GetLastErrorDesc();
						errorMsgInfo(errorDesc);
					}
				}
				function errorMsgInfo(msg){
					M.ui.status.init({
                        position: 'fixed',
                        html: msg,
                        callback: function() {
                            // console.log('callback')
                        },
                        close: function () {

                        }
                    });
				}
				
				 return {
						 SignP7OnClick: SignP7OnClick,
						 SignOnClick: SignOnClick,
			            init: function (callback, that) {

			                try{

		                    	that.isClick = false;
			                    if (that.signStatus === 0) {
			                    	OnLoad();
			                       // TCA.config(config);
			                        that.signStatus = 1;
			                        SelectCertificateOnClick();
			                       // initCertList();
			                        that.signStatus = 2;
			                        callback();
			                        return ;
			                    }else if (that.signStatus === 1) {
			                    	SelectCertificateOnClick();
			                        that.signStatus = 2;
			                        callback();
			                        return ;
			                    }else if (that.signStatus === 2) {
			                        callback();
			                        return ;
			                    }

			                }catch(e){
			                    return M.ui.status.init({
		                            position: 'fixed',
		                            html: CryptoAgent.GetLastErrorDesc(),
		                            callback: function() {
		                                // console.log('callback')
		                            },
		                            close: function () {

		                            }
		                        });
			                }
			            }
			        }
			})

})(window.jQuery, window);
