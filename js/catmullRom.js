var CatmullRom = {
  smoothness : 10,
  getPointOnSpline : function( p0, p1, p2, p3, t ) {
    var result = [ 0, 0, 0 ];
    result[0] = 0.5*((2*p1[0])+
              (-p0[0]+p2[0])*t+
       (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t*t+
       (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t*t*t);
    result[1] = 0.5*((2*p1[1])+
       (-p0[1]+p2[1])*t+
       (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t*t+
       (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t*t*t);
    result[2] = 0;
       return result;
  },
  revolve : function( yArray, callback )
  {
    var geometry = new THREE.Geometry();
    for(var y = yArray.length-1; y > 20 ; y=y-10){
      var radius = ctx.canvas.width/2 -  yArray[y][0] ;
      var radius2 =  ctx.canvas.width/2 - yArray[y-10][0] ;
      for (var i = Math.PI * 2; i > 0; i--) {
        var x = Math.sin(i) * radius;
        var z = Math.cos(i) * radius;
        var x2 = Math.sin(i-1) * radius2;
        var z2 = Math.cos(i-1) * radius2;
        var x3 = Math.sin(i) * radius2;
        var z3 = Math.cos(i) * radius2;
        var x4 = Math.sin(i-1) * radius;
        var z4 = Math.cos(i-1) * radius;
        var point1 = new THREE.Vector3(x,yArray[y][1],z);
        var point2 = new THREE.Vector3(x2,yArray[y-10][1],z2);
        var point3 = new THREE.Vector3(x3,yArray[y-10][1],z3);
        var point4 = new THREE.Vector3(x4,yArray[y][1],z4);
        geometry.vertices.push(point1);
        geometry.vertices.push(point2);
        geometry.vertices.push(point3);
        geometry.vertices.push(point4);
         var U1 = [point3.x-point2.x,point3.y-point2.y,point3.z-point2.z];
         var U2 = [point4.x-point2.x,point4.y-point2.y,point4.z-point2.z];
         var V1 = [point1.x-point2.x,point1.y-point2.y,point1.z-point2.z];
         var V2 = [point1.x-point2.x,point1.y-point2.y,point1.z-point2.z];
        var normal1 = [U1[1]*V1[2] - U1[2]*V1[1], U1[2]*V1[0] - U1[0]*V1[2], U1[0]*V1[1] - U1[1]*V1[0]];
        var normal2 = [U2[1]*V2[2] - U2[2]*V2[1], U2[2]*V2[0] - U2[0]*V2[2], U2[0]*V2[1] - U2[1]*V2[0]];
      
        geometry.faces.push( new THREE.Face3( point3, point2, point1, normal1 ) );
        geometry.faces.push( new THREE.Face3( point2, point4, point1, normal2 ) );
        
      };
    }
    
    callback(geometry);
  },
  revolve2 : function( yArray, callback )
  {
    var vertices = [];
    var faces = [];
    var uvs = [];
    for ( y = 0; y < yArray.length; y ++ ) {
      var verticesRow = [];
      var uvsRow = [];
      var radius = ctx.canvas.width/2 -  yArray[y][0] ;
      for ( x = 0; x <= 2 * Math.PI; x = x + 0.1 ) {

        var u = x / (2*Math.PI);
        var v = y / yArray.length;

        var vertex = new THREE.Vector3();
        vertex.x = radius * Math.sin(x);
        vertex.y = yArray[y][1];
        vertex.z = radius * Math.cos(x);

        vertices.push( vertex );

        verticesRow.push( vertices.length - 1 );
        uvsRow.push( new THREE.Vector2( u, 1 - v ) );

      }

      vertices.push( verticesRow );
      uvs.push( uvsRow );
    }
    console.log(vertices);
    for ( y = 0; y < yArray.length; y ++ ) {

      for ( x = 0; x < 2*Math.PI; x = x + 0.1 ) {

        var v1 = vertices[ y ][ x + 1 ];
        var v2 = vertices[ y ][ x ];
        var v3 = vertices[ y + 1 ][ x ];
        var v4 = vertices[ y + 1 ][ x + 1 ];

        var n1 = vertices[ v1 ].clone().normalize();
        var n2 = vertices[ v2 ].clone().normalize();
        var n3 = vertices[ v3 ].clone().normalize();
        var n4 = vertices[ v4 ].clone().normalize();

        var uv1 = uvs[ y ][ x + 1 ].clone();
        var uv2 = uvs[ y ][ x ].clone();
        var uv3 = uvs[ y + 1 ][ x ].clone();
        var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

        // if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

        //   this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
        //   this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

        // } else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

        //   this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        //   this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

        // } else {
          faces.push( new THREE.Face3( v3, v2, v1, [ n3, n2, n1 ] ) );
          faceVertexUvs[ 0 ].push( [ uv3, uv2, uv1 ] );
          faces.push( new THREE.Face3( v3, v4, v1, [ n3, n4, n1 ] ) );
        //}

      }
    }
    callback(vertices);
  }
}
