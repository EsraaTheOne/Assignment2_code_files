// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Transitive Closure Package
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//
var _v = [],
    _e = []; // note naming conventions in upload guide


// -----------------------------------------------------------------------
function _main()
{
    // create a graph (default undirected)
    var g = new Graph();

    // set input graph properties
    g.label = 'Figure 8.11 (Levitin, 3rd edition)';
    g.digraph = true;

    // use global input arrays _v and _e to initialize internal data structures
    g.readGraph(_v, _e);

    // use printGraph() to check graph
    g.printGraph();

    g.topoSearch(0);
    document.write("<p>dfs_push: ", g.dfs_push, "</p>");

    // report connectivity status if available
    document.write("<p>", g.componentInfo(), "</p>");

    // perform BFS  and output stored result
    g.topoSearch(1); // 0 means DFS choice, while 1 mean BFS choice of topological search
    document.write("<p>bfs_order: ", g.bfs_order, "</p>");

    // output DFS-based transitive closure matrix
    g.DfsTC();
    document.write("<p> TC matrix: <br>");

    for (var i = 0; i < g.dfsTC.length; i++)
    {
        document.write(g.dfsTC[i], "<br>");
    }

}
// -----------------------------------------------------------------------

function Vertex(v)
{
    // published docs section (ref. assignment page)
    // for this section, strip line comments
    // no JSDOC comments in this section

    // base property fields from P1M1

    this.label = v.label; // ... complete from P1M1 (remove comment)
    this.visit = false; // vertex can be marked visited or "seen"
    this.adjacent = new List(); // init an adjacency list

    // base member methods from P1M1
    this.adjacentByID = adjacentByIdImpl; // Get id of adjacent vertices in an array.
    this.incidentEdges = incidentEdgesImpl; // return target id of incident edges in array
    this.vertexInfo = vertexInfoImpl; // Get vertex details in a printable string
    this.insertAdjacent = insertAdjacentImpl; // Insert a new edge node in the adjacency list of vertex.

    // --------------------
    // more student fields next


    // --------------------
    // more student methods next

}

// -----------------------------------------------------------------------

function Edge(vert_i, weight)
{
    // published docs section (ref. assignment page)
    // for this section, strip line comments
    // no JSDOC comments in this section


    // base property fields

    this.target_v = vert_i; 
    this.weight = weight;

    // base member methods


    // --------------------
    // more student fields next


    // --------------------
    // more student methods next

}


// -----------------------------------------------------------------------

function Graph()
{
    // published docs section (ref. assignment page)
    // for this section, strip line comments
    // no JSDOC comments in this section


    // base property fields

    this.vert = [];
    this.nv = 0;
    this.ne = 0; // number of edges
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.weighted = false; // true if weighted graph, false otherwise (default unweighted)
    this.dfs_push = []; // DFS order output
    this.bfs_order = []; // BFS order output
    this.label = ""; // identification string to label graph
    this.connectedComp = 0; // number of connected comps set by DFS; 0 (default) for no info
    this.adjMatrix = []; // graph adjacency matrix to be created on demand

    // base member methods
    this.listVerts = listVertsImpl; // List graph vertices using info strings returned by Vertex methods
    this.readGraph = better_input;
    this.addEdge = addEdgeImpl2; // Insert an edge
    this.printGraph = printGraphImpl; // better printer function
    this.makeGraph = makeGraphImpl; // Create a graph
    this.dfs = dfsImpl; // DFS a connected component
    this.bfs = bfsImpl; // BFS a connected component
    this.makeAdjMatrix = makeAdjMatrixImpl2; // Create adjacency (or weight, if graph weighted) matrix
    this.isConnected = isConnectedImpl; // Test if graph is connected returning true, otherwise false
    this.componentInfo = componentInfoImpl; // Get printable connectivity info strings
    this.topoSearch = topoSearchImpl; // perform a topological search

    // --------------------
    // more student fields next


    // --------------------
    // more student methods next 
    //this.floydD = [];
    //this.warshallTC = [];
    /**
    	Transitive closure matrix , set after applying DfsTC.
    	Stores output of last DfsTC call.
    	@default [ ]
    */
    this.dfsTC = [];
    /**
    	Check if there is a path between two vertices in a digraph
    	@method
    */
    this.hasPath = hasPathImpl; // boolean, true if path exists between vertices v_i, v_j in digraph
    /**
    	Get the length of the shortest path between two vertices in a weighted graph
    	@method
    */
    this.shortestPath = shortestPathImpl; // return distance of shortest path between v_i, v_j in weighted graph 
    /**
    	Test if the diagraph is Directed Acyclic Graph
    	@method
    */
    this.isDAG = isDAGImpl; // boolean, true if acyclic digraph
    //this.warshallFloyd = warshallFloydImpl;       // inserts .tc field in adjacency matrix if digraph, and .dist if weighted
    /**
    	Compute DFS-Based TC matrix
    	@method
    */
    this.DfsTC = dfsTCImpl; // return TC matrix for digraph based on a dfs

}


// -----------------------------------------------------------------------
// functions used by methods of Graph and ancillary objects

// -----------------------------------------------------------------------
// begin student code section
// -----------------------------------------------------------------------

// transitive closure package 
/**
   Check if -> a path exists between two vertices by their ID's

   @implements hasPathImpl		
   @param {integer} u_i global source v idInput edge object
   @param {integer} v_i global target v idInput vertex object
   @returns {boolean} True if there is path between u_i & v_i
   
   @author 2020, Esraa Abdulrahim
   @version Version 1.1 (2020)
*/
function hasPathImpl(u_i, v_i)
{
    return this.warshallTC[u_i][v_i] == 1 ? true : false;
}

// -----------------------------------------------------------------------
/**
	Return the shortest path between two vertices using their ID's
	
	@implements shortestPathImpl
	@param {number} u_i global source ver id Input edge object
	@param {number} v_i global target ver id Input vertex object
	@returns {integer} The shortest path between u_i & v_i
	
	@author 2020, Esraa Abdulrahim
*/
function shortestPathImpl(u_i, v_i)
{
    return this.floydD[u_i][v_i];
}

// -----------------------------------------------------------------------
// published docs section (ref. assignment page)
// use starter6-based P1M1 code as-is (fixes/improvements OK)
// no JSDOC comments in this section (docs already published)
// -----------------------------------------------------------------------

/**
	Return the case of the Graph -> True if it's Directed Acyclic Graph
	
	@implements isDAGImpl
	@returns {boolean} True if diagraph is DAG, false otherwise
	
	@author 2020, Esraa Abdulrahim
*/
function isDAGImpl()
{
    for (var i = 0, j = 0; i < this.warshallTC.length && j < this.warshallTC.length; i++, j++)
        if (this.hasPath(i, j))
            return false;
    return true;
}

/**
	Looking for shortest distance from 1 vertex to all the other vertices
	
	@implements warshallFloydImpl
	
	@author 2020, Esraa Abdulrahim
*/
function warshallFloydImpl()
{
    // implement the ADJACENCY matrix 
    this.makeAdjMatrix();

    // Fill warshallTC[] and distance matrices (floydD[]) by adjacent matrix
    for (var k = 0; k < this.adjMatrix.length; k++)
    {
        // Copy row by row
        this.warshallTC[k] = this.adjMatrix[k].slice();
        this.floydD[k] = this.adjMatrix[k].slice();
        for (var x = 0; x < this.nv; x++)
        {
            if (this.adjMatrix[k][x] == 0 && k != x)
            {
                this.floydD[k][x] = Infinity;
            }
        }
    }

    // warshall-Floyed algorithm
    for (var k = 0; k < this.floydD.length; k++)
    {
        for (var i = 0; i < this.floydD.length; i++)
        {
            for (var j = 0; j < this.floydD.length; j++)
            {
                this.floydD[i][j] = Math.min(this.floydD[i][j], (this.floydD[i][k] + this.floydD[k][j]));
                this.warshallTC[i][j] = this.warshallTC[i][j] || (this.warshallTC[i][k] && this.warshallTC[k][j]) ? 1 : 0;
            }
        }
    }

    // assign Infinity to 0 when there's no distance
    for (var i = 0; i < this.floydD.length; i++)
        for (var j = 0; j < this.floydD.length; j++)
            if (this.floydD[i][j] == Infinity)
                this.floydD[i][j] = 0;

}

// -----------------------------------------------------------------------
/**
   Better efficiency Algorithm for Looking for shortest distance from 1 vertex to all the other vertices
	
   @implements dfsTCImpl
   
   @author 2020, Esraa Abdulrahim
*/
function dfsTCImpl()
{
    // for each vertex
    for (var i = 0; i < this.nv; i++)
    {
        //process vertex v
        var v = this.vert[i];

        // mark all vertices unvisited
        for (var p = 0; p < this.nv; p++)
        {
            this.vert[p].visit = false;
        }

        // create and init the corresponding row 
        this.dfsTC[i] = [];
        for (var j = 0; j < this.nv; j++)
            this.dfsTC[i][j] = 0;

        //perform DFS search for each adjacent to the vertex v by its ID
        var w = v.adjacentByID();
        for (var n = 0; n < w.length; n++)
            this.dfs(w[n]); //for each adjacent vertex call dfs()

        //traverse the vertices to check which is visited
        for (var k = 0; k < this.nv; k++)
        {
            //if visited set 1 in the corresponding TC matrix
            if (this.vert[k].visit)
            {
                this.dfsTC[i][k] = 1;
            }
        }
    }
}

// -----------------------------------------------------------------------
function addEdgeImpl(u_i, v_i)
{
    //fetch vertices using their idm where u: edge source vertex, v: target vertex
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    //insert (u,v), i.e. insert v (by id) in adjacency list of u
    u.adjacent.insert(v_i);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        v.adjacent.insert(u_i);
    }
}

// -----------------------------------------------------------------------
function addEdgeImpl2(u_i, v_i, weight)
{
    // fetch vertices using their id, u -> edge source vertex, v -> target vertex
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    var e = new Edge();
    e.target_v = v_i;
    e.weight = weight;
    u.adjacent.insert(e);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        e = new Edge();
        e.target_v = u_i;
        e.weight = weight;
        v.adjacent.insert(e);
    }
}

// -----------------------------------------------------------------------
function addEdgeImpl3(u_i, v_i, weight)
{
    // fetch vertices using their id, where u: edge source vertex, v: target vertex
    var u = this.vert[u_i];
    var v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass object)
    u.insertAdjacent(v_i, weight);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        v.insertAdjacent(u_i, weight);
    }
}

// -----------------------------------------------------------------------
function adjacentByIdImpl()
{
    var adjacentArr = [];
    var adjacency_list = this.adjacent.traverse();
    for (var i = 0; i < adjacency_list.length; i++)
    {
        adjacentArr[i] = adjacency_list[i].target_v;
    }
    return adjacentArr;
}

// -----------------------------------------------------------------------
function bfsImpl(v_i)
{
    // get vertex v by its id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;
    this.bfs_order[this.bfs_order.length] = v_i;

    // initialize queue with v
    var q = new Queue();
    q.enqueue(v);

    // while queue not empty
    while (!q.isEmpty())
    {
        // dequeue and process a vertex, u
        var u = q.dequeue();

        // queue all unvisited vertices adjacent to u
        var w = u.adjacentByID();
        for (var i = 0; i < w.length; i++)
        {
            if (!this.vert[w[i]].visit)
            {
                this.vert[w[i]].visit = true;
                q.enqueue(this.vert[w[i]]);
                this.bfs_order[this.bfs_order.length] = w[i];
            }
        }
    }
}

// -----------------------------------------------------------------------
function componentInfoImpl()
{
    var out;
    switch (this.connectedComp)
    {
        case 0:
            out = "no connectivity info";
            break;
        case 1:
            out = "CONNECTED";
            break;
        default:
            out = "DISCONNECTED " + this.connectedComp;
            break;
    }
    return out;
}

// -----------------------------------------------------------------------
function dfsImpl(v_i)
{
    // get vertex v by its id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;
    this.dfs_push[this.dfs_push.length] = v_i;

    // recursively traverse unvisited adjacent vertices 
    var w = v.adjacentByID();
    for (var i = 0; i < w.length; i++)
    {
        if (!this.vert[w[i]].visit)
        {
            this.dfs(w[i]);
        }
    }
}

// -----------------------------------------------------------------------
function incidentEdgesImpl()
{
    //array of objects
    var enode = [];
    var w = this.adjacent.traverse();
    for (var i = 0; i < w.length; i++)
    {
        enode[i] = {
            "adjVert_i": w[i].target_v,
            "edgeLabel": "",
            "edgeWeight": w[i].weight
        }
    }
    return enode;
}

// -----------------------------------------------------------------------
function list_vert()
{
    // Implemented as -> listVertsImpl -> Name from graph0_jsdoc3
} // etc.

// -----------------------------------------------------------------------
function insertAdjacentImpl(v_i, weight)
{
    this.adjacent.insert(new Edge(v_i, weight));
}

// -----------------------------------------------------------------------
function isConnectedImpl()
{
    return this.connectedComp == 0 ? true : false;
}

// -----------------------------------------------------------------------
function listVertsImpl()
{
    var i, v; // local variables
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }
}

// -----------------------------------------------------------------------
function makeAdjMatrixImpl()
{
    //adjacency matrix initialzied by zero
    for (var i = 0; i < this.nv; i++)
    {
        this.adjMatrix[i] = [];

        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }
    }

    // when vertex has an adjacency set 1
    var v, w;
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        w = v.adjacentById();
        for (var j = 0; j < w.length; j++)
        {
            this.adjMatrix[i][w[j]] = 1;
        }
    }
}

// -----------------------------------------------------------------------
function makeAdjMatrixImpl2()
{
    for (var i = 0; i < this.nv; i++)
    {
        //get vertex
        var v = this.vert[i];

        //create and initialize the corresponding row
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        //process adjacent vertices: get by edge node, set value for each
        var e = v.adjacent.traverse(),
            m = e.length; //note encap mistake
        for (var j = 0; j < m; j++)
        {
            this.adjMatrix[i][e[j].target_v] = this.weighted ? e[j].weight : 1;
        }
    }
}

// -----------------------------------------------------------------------
function makeAdjMatrixImpl3()
{
    for (var i = 0; i < this.nv; i++)
    {
        // get vertex
        var v = this.vert[i];

        // create and initialize the corresponding row
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        // process adjacent vertices: get by edge node, set value for each
        var e = v.adjacentByID();
        var info = v.incidentEdges();
        for (var j = 0; j < e.length; j++)
        {
            this.adjMatrix[i][e[j]] = this.weighted ? info[j].edgeWeight : 1;
        }
    }
}

// -----------------------------------------------------------------------
function makeGraphImpl(n, m, w)
{

}

// -----------------------------------------------------------------------
function topoSearchImpl(fun)
{
    // mark all vertices unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }
    // traverse a connected component 	
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            fun == 0 ? (this.connectedComp++, this.dfs(i)) : (this.connectedComp++, this.bfs(i));
        }
    }
}

// -----------------------------------------------------------------------
function vertexInfoImpl()
{
    return " {" + this.label + "} - VISIT: " + this.visit + " - ADJACENCY: " + this.adjacentByID();
}

// -----------------------------------------------------------------------
function printGraphImpl()
{
    document.write("<p>GRAPH {", this.label, "} ",
        this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>",
        this.componentInfo(), "</p>");

    // list vertices
    this.listVerts();
}


// -----------------------------------------------------------------------
function better_input(v, e)
{
    // set number of vertices and edges fields
    this.nv = v.length;
    this.ne = e.length;
    // input vertices into internal vertex array
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }
    // input vertex pairs from edge list input array
    // remember to pass vertex ids to add_edge() 
    for (var i = 0; i < this.ne; i++)
    {
        this.addEdge(e[i].u, e[i].v, e[i].w);
    }
    // double edge count if graph undirected 
    if (!this.digraph)
    {
        this.ne = e.length * 2;
    }
    // check if the graph is weighted or not 
    if (!(e[0].w == undefined))
    {
        this.weighted = true;
    }
}

// -----------------------------------------------------------------------
function better_output()
{
    // note bad pattern for long-term code
    var output;
    switch (this.connectedComp)
    {
        case 0:
            output = "no connectivity info";
            break;
        case 1:
            output = "CONNECTED";
            break;
        default:
            output = "DISCONNECTED " + this.connectedComp;
            break;
    }

    document.write("<p>GRAPH {", this.label, "} ",
        this.weighted ? "" : "UN", "WEIGHTED, ",
        this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>",
        out, "</p>");

    // list vertices
    this.list_vert();
}