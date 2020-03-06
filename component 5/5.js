// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Reorganized Code
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed

// note carefully close-to-final source file organization
var _v = [],
    _e = []; // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main()
{
    // create a graph (default undirected)
    // note g no longer a global var
    var g = new Graph();

    // set graph properties - set a suitable label

    g.read_graph(_v, _e);

    g.label = "Figure 3.10 (Levitin, 3rd edition)}";

    g.print_graph();

    g.DFS();	// apply dfs
    document.write("<p>", g.dfs_push, "</p>");

    g.BFS();	// apply bfs
    document.write("<p>", g.bfs_out, "</p>");



}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
    // user input fields
    this.label = v.label; // vertex can be labelled

    // more fields to initialize internally

    this.visit = false; // vertex can be marked visited or "seen"
    this.adjacent = new List(); // init an adjacency list

    // --------------------
    // member methods use functions defined below

    this.adjacentById = adjacentById;


}

// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
    this.vert = []; // vertex list (an array of Vertex objects)
    this.nv; // number of vertices
    this.ne; // number of edges
    this.digraph = false; // true if digraph, false otherwise (default undirected)
    this.dfs_push = []; // DFS output
    this.dfs_pop = []; // DFS pop order out-put array
    this.bfs_out = []; // BFS output


    // --------------------
    // student property fields next

    this.label = ""; // (fill) identification string to label graph


    // --------------------
    // member methods use functions defined below

    this.read_graph = better_input; // default input reader method
    this.list_vert = list_vert;
    this.print_graph = better_output; // (replace) better printer function
    this.add_edge = add_edge;


    this.DFS = DFS; // perform a depth-first search
    this.dfs = dfs; // DFS a connected component
    this.BFS = BFS; // perform a breadth-first search
    this.bfs = bfs; // BFS a connected component


    // --------------------
    // student methods next; implementing functions in student code section at end


}


// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------
function list_vert()
{
    var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, " {", v.label,
            "} - VISIT: ", v.visit,
            " - ADJACENCY: ", v.adjacent.traverse(), "<br>");
    }
}

// --------------------
function better_input(v, e)
{

    // set -> vertex & edge count
    this.nv = v.length;
    this.ne = e.length;

    // insert vertex in internal vert array
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }

    // insert vert pairs from -> edge list input array
    for (var i = 0; i < this.ne; i++)
    {
        this.add_edge(e[i].u, e[i].v);
    }

    // in the undirected graph -> double edge (back & forth)
    if (!this.digraph)
    {
        this.ne = e.length * 2;
    }
}

// --------------------
function add_edge(u_i, v_i)
{
    // fetch edge vert by id 
    var u = this.vert[u_i]; // source vertex 
    var v = this.vert[v_i]; //  target vertex

    // insert u & v, -> in adjacency list of u

    u.adjacent.insert(v_i);

    // insert u & v, in undirected graph -> repeat in reverse vertex order (back & forth)
    if (!this.digraph) // not directed
    {
        v.adjacent.insert(u_i);
    }
}

// --------------------
function DFS()
{
    // mark all vert as unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }

    // traverse unvisited connected components
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit) // not visited
        {
            this.dfs(i); // applay dfs
        }
    }
}

// --------------------
function dfs(v_i)
{
    // get landing vert by id 
    var v = this.vert[v_i];
    v.visit = true;
    len = this.dfs_push.length;
    this.dfs_push[len] = v_i;

    // recursive traverse on unvisited adjacent vert
    var w = v.adjacentById();
    for (var j = 0; j < w.length; j++)
    {
        if (!this.vert[w[j]].visit) // not visited
        {
            this.dfs(w[j]);
        }
    }

    len_pop = this.dfs_pop.length;
    this.dfs_pop[len_pop] = v_i;
}

// --------------------
function BFS()
{
    // mark all v as unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }

    // traverse the unvisited connected components
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            this.bfs(i);
        }
    }
}

// --------------------
function bfs(v_i)
{
    // get vertex v by id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;

    // initialize queue -> with v
    var q = new Queue();
    q.enqueue(v_i);


    // while queue not empty
    while (!q.isEmpty())
    {

        // dequeue & process a vertex, u
        var u_i = q.dequeue();
        var u = this.vert[u_i];
        this.bfs_out[this.bfs_out.length] = u_i; // bfs_out array  if filled -> when dequeu the vertex


        // queue unvisited vertices adjacent to u
        var w = u.adjacentById();
        for (var i = 0; i < w.length; i++)
        {
            if (!this.vert[w[i]].visit)
            {
                this.vert[w[i]].visit = true;
                q.enqueue(w[i]);
            }
        }
    }
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------

function better_output() // new default graph output method
{
    document.write("<p>GRAPH {", this.label, this.digraph ? "" : " UN", "DIRECTED - ",
        this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");

    this.list_vert();
}

// --------------------
function adjacentById() // initally just a wrapper for .traverse
{
    return this.adjacent.traverse();
}