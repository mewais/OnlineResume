# Instruction Offloading to HMC

## Introduction
Graph processing and pointer chasing applications today suffer from bad cache locality, which means that no matter how you increase the cache size (realistically) or reorganize it or change line sizes, those applications are still going to suffer high miss rates. This project addresses this problem by trying to make the poor locality memory accesses skip the caches and happen off the critical path. This frees up the caches to serve high locality memory accesses and decreases cache pollution, thus improving the overall performance. To do so, we utilize DRAM memories called Hybrid Memory Cubes, or HMCs. HMCs are 3D DRAM structures, with 4 or 8 layers of DRAM stacked above a logic layer. HMC have very high bandwidth due to the parallelism offered by their 3D structure, and they also have the capability of executing some atomic operations in the memory itself.

## Motivation
As mentioned before, graph processing applications suffer from bad locality and thus bad cache utilization and high memory access latency. We begin by identifying the specific hot instructions that are responsible for poor cache locality and then we show how much improvement we can get by idealizing those memory accesses.

### Instrumentation
To identify the instructions responsible for the bad locality and their impact on performance, we propose using a metric called Memory Reuse Distance. Memory Reuse Distance is basically the time between multiple accesses to the same memory location. However, gathering this data proved by other to be a non straightforward task, specially if we want to calculate it per instruction. Thus, we relax our proposal to instead just use an approximation of memory reuse distance, which is simply cache miss rates. We believe this approximation is intuitive, as when the memory reuse distance is very high it means there is none or very little locality, and vice versa.

1. We use zsim as our simulator, with some modifications we are able to make zsim report the miss rates of all caches per instruction pointer address. Cross referencing this output with the assembly of our benchmarks allows us to identify the instructions with high miss rates. The simulator modifications and the results can be found [in this repo](), and the results can also be seen below.
2. We annotated the benchmarks with special triggers before and after the target hotspots, then modified zsim differently to be able to idealize the memory accesses between the triggers. In this case idealization simply handles those memory accesses as hits right away, without propagating them through the rest of the memory hierarchy. This represents the upper limit improvement we could get by handling those memory accesses off the critical path, for example by offloading them to HMC, without having them block or stall the CPU.

The following figure(s) shows all the benchmarks, the triggers in each of them, and the possible improvement one can get by idealizing the memory accesses between the triggers. The memory access types we have identified are as follows:
* 2 Operand Arithmetic: for example `A[i] = A[i] + B[j];`
* 3 Operand Arithmetic: for example `A[i] = B[j] + C[k];`
* Min/Max: for example `if (x[i] > y) x[i] = y;`
* Indirect Access: for example, something like `A[B[i]]` is an indirect access, and storing the value of `B[i]` in the cache might hurt the performance if it's never reused.
* Write Bypass: A simple write operation, only it doesn't have cache locality so it's preferred to not keep it in the cache `A[i] = 0;`
* Conditional Copy: for example `if (cond) A[i] = B[j];`
* Swap (Test and Set): for example `if (A[i] = 0) A[i] = 1;`
* Compare/Test: for example `A[i] == 0`
* HMC: Which is the collection of these operations supported by HMC.
* eHMC: or extended HMC, Which is a hypothetical version of HMC that supports all of the required operations.

Note that some of these should be able to return the results of their operations back.

An asterisk on the left side will mark lines with triggers to zsim.


