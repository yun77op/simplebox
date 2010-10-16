<?php
/*
Plugin Name: Simplebox for wordpress
Plugin URI: http://www.devilalbum.com/2010/10/simplebox-for-wordpress-2-0/
Description: Inspired by FancyBox, but written in native javascript without the dependence of jQuery. It supports normal image types, swf movies, html snippets and html5 video.
Version: 2.0
Author: yun77op
Author URI: http://devilalbum.com/
License : GPL v3
*/

 if ( ! function_exists( 'is_ssl' ) ) {
  function is_ssl() {
   if ( isset($_SERVER['HTTPS']) ) {
    if ( 'on' == strtolower($_SERVER['HTTPS']) )
     return true;
    if ( '1' == $_SERVER['HTTPS'] )
     return true;
   } elseif ( isset($_SERVER['SERVER_PORT']) && ( '443' == $_SERVER['SERVER_PORT'] ) ) {
    return true;
   }
   return false;
  }
 }

 if ( version_compare( get_bloginfo( 'version' ) , '3.0' , '<' ) && is_ssl() ) {
  $wp_content_url = str_replace( 'http://' , 'https://' , get_option( 'siteurl' ) );
 } else {
  $wp_content_url = get_option( 'siteurl' );
 }
 $wp_plugin_url = $wp_content_url . '/wp-content/plugins';

define('SPB_URL', $wp_plugin_url . '/simplebox-for-wordpress');


function simplebox_init(){

	$js_url=SPB_URL . '/simplebox.js';
	$css_url=SPB_URL . '/simplebox.css';
	$js_util_url=SPB_URL . '/simplebox_util.js';
	$simple_string =<<<EOT
<script type="text/javascript" src="$js_util_url"></script>
<script type="text/javascript">
(function(){
	var boxes=[],els,i,l;
	if(document.querySelectorAll){
		els=document.querySelectorAll('a[rel=simplebox]');	

		Box.getStyles('simplebox_css','$css_url');
		Box.getScripts('simplebox_js','$js_url',function(){
				simplebox.init();
				for(i=0,l=els.length;i<l;++i)
					simplebox.start(els[i]);
				simplebox.start('a[rel=simplebox_group]');			
				});
	}
	

})();
</script>
EOT;
	echo $simple_string;
}


add_action('wp_footer', 'simplebox_init');
?>
