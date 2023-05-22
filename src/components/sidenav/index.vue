<template>
  <div id="Sidenav">
    <div class="fix_nav">
      <div class="fix_nav_item"><h1><a href="#" /></h1></div>
      <div class="fix_nav_item"><h1><a href="#" /></h1></div>
      <div class="fix_nav_item"><h1><a href="#" /></h1></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  }
}
</script>
      <style>
        *{
          margin: 0;
          padding: 0;
        }
        a{
          text-decoration: none;

        }
        .row{
          width: 1140px;
          margin: 0 auto;
        }
        .c{
          clear: both;
        }
        @media screen and (max-width: 1355px){
        .fix_nav{
          display: none;
        }
        }
        @media screen and (min-width: 1355px){
        .fix_nav{
          position: fixed;
          bottom: 100px;
          right: 3%;
          border-radius: 5px;
          background: #f1f1f1;
          box-shadow:  5px 5px 10px #a4a4a4,
                      -5px -5px 10px #ffffff;
        }
        .fix_nav_item a{
          color: rgb(85, 78, 78);
        }
        .fix_nav_item{
          border-radius: 5px;
          padding: 10px 10px 0;
          border-bottom: solid 1px #a4a4a4;
        }
        .fix_nav_item a:hover{
          position: relative;
          left: 2px;
        }}
      </style>
