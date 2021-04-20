## Research and Projects

### HDLElaborator ![](https://img.shields.io/badge/-Personal-informational) ![](https://img.shields.io/badge/status-Ongoing-yellow)

A couple of years ago I tried to build a CAD tool that would be able to compile both VHDL and Verilog. We started with Lex and Yacc grammars and started using them for parsing. This quickly proved to be a very tedious task that we didn't have enough time for.
Recently I came across the awesome [hdlConvertor library](https://github.com/Nic30/hdlConvertor) library. The library is capable of reading Verilog and VHDL files, and producing a unified AST for them. So I decided to revisit the topic and create my HDLElaborator library, taking in the AST as an input and generating a netlist as an output. This is currently under heavy development and is my current side project.
The library will be open sourced when it starts to be at least partially functional.


### FPGA virtualization and containerization ![](https://img.shields.io/badge/-University%20of%20Toronto-yellowgreen) ![](https://img.shields.io/badge/status-Ongoing-yellow)

This is currently my main focus in my PhD. The idea is to allow FPGAs to be first class citizens in datacenters, essentially being able to virtualize them, deploy applications on them, share them between different users, and be able to scale up their applications. Currently we're able to do the following:
* Disover FPGAs connected to datacenter nodes and advertise them as available resources. This is currently two components:
  * A modification to kubernetes device plugin API, found [here](https://github.com/kubernetes/kubernetes/pull/91190)
  * A device plugin to discover and utilize FPGAs, found [here](https://github.com/mewais/FPGA-K8s-DevicePlugin)
* Build docker containers that utilize FPGAs, this currently is focused on FPGA based VNFs.
* Deploy FPGA containers and utilize them in a cluster.
* This work will be open sourced upon acceptance of the publication.


### FPGA VNF implementations ![](https://img.shields.io/badge/-University%20of%20Toronto-yellowgreen) ![](https://img.shields.io/badge/status-Ongoing-yellow)

This is part of my PhD work, which is implementing different 100G VNFs on FPGAs, this is still in its early phases (as is my PhD, currently). So far we have an implementation of a 100G Firewall and a 100G Traffic Generator. This is still ongoing with more VNFs.  
  

### ShellCreator ![](https://img.shields.io/badge/-Personal-informational) ![](https://img.shields.io/badge/status-Maintained-green)

[ShellCreator](https://github.com/mewais/ShellCreator) is asimple python library that helps create complete shells (command line interfaces) for user applications. Think the interactive shell of Vivado, Design Compiler, a bash shell, etc. The library has support for data types, if statements, while statements, autocompletion, colorization, indentation, and many other features. Users can simply extend the library with their own defined commands.
![](assets/images/shell1.png)
![](assets/images/shell2.png)


### Online Resume ![](https://img.shields.io/badge/-Personal-informational) ![](https://img.shields.io/badge/status-Finished-green)
This website, the one you're looking at right now. I wanted something that includes everything I'd like to add in my resume, without the size restrictions. This website will be under constant improvement and addition to make it up to date.

The source code can be found [here](https://github.com/mewais/Resume)


### ML Accelerator Virtual ISA ![](https://img.shields.io/badge/-Huawei%20Technologies-brown) ![](https://img.shields.io/badge/status-Finished-green)

This was another project I worked on while at Huawei Technologies. I was mainly leading the following aspects:
* Designing and validating a new Virtual ISA for in-house AI accelerator chips. Similar in nature to NVidia PTX.
* Maintain Virtual ISA forward compatibility and coverage over all chip generations.
* Full definition and addition of the new Virtual ISA target to LLVM.

At the time of my leaving Huawei, we had a working draft that we were going to improve, I'm not sure what is the status of the project now.  
  

### GPU LLVM Compiler ![](https://img.shields.io/badge/-Huawei%20Technologies-brown) ![](https://img.shields.io/badge/status-Finished-green)

This was the bulk of my work while at Huawei Technologies. I was part of team working on implementing an LLVM based compiler for a first generation in-house built GPU. I was mainly the owner and responsible of the following:
* TableGen pattern matching and optimizations.
* Adding, modifying, or fixing various optimization CodeGen passes.
* Debugging and fixing C models.

The compiler was finished after I left Huawei, it is now being used successfully and the GPUs will be available in consumer phones sometime soon.  
  

### Instruction Offloading to HMC ![](https://img.shields.io/badge/-Personal-informational) ![](https://img.shields.io/badge/status-Abandoned-red)

This was a personal project out of interest. It aimed at utilizing 3D memories called Hybrid Memory Cubes, which are capable of executing some simple operations in memory. The idea is to use a metric called "Memory Reuse Distance" to decide which instructions are not utilizing the caches and are thus better suited for offloading and might benefit more from execution directly on the HMC. So far the following is done:
* Analysis of benchmarks to determine hot spots.
* Idealization (i.e. upper limit improvement) of all benchmarks.  

The following is yet to be done:
* Simulation of real offloading (with delay) in a simulated system.
* Building a predictor to decide what instructions to offload.

This project was abandoned when I found a paper implementing the exact same idea. My code and progress can be found [here](https://github.com/mewais/AwesomeInstructionOffloading).  
  

### Cache Compression and Approximation ![](https://img.shields.io/badge/-University%20of%20British%20Columbia-blueviolet) ![](https://img.shields.io/badge/status-Finished-green) [![](https://img.shields.io/badge/-Detailed%20Results-important)](/CacheCompression)

This was my work during my MSc, eventually this was published in my thesis, plus two conference papers. This work was focused on building caches that support compression, or approximation, or both. During this work I did the following:
* Analysis of data patterns, inter-block, and intra-block entropy in cache dumps of multiple benchmarks.
* Design of a new cache compression scheme that is capable of performing inter and intra line compression.
* Implementation of the new cache design as well as previous implementations using the zsim simulator.
* Investigation of approximation (lossy compression) and incorporating it in the compressed cache designs.  

All the different caches and their implementation can be found [here](https://github.com/mewais/zsim-CacheCompression). A page with the detailed results of this work can be found [here](/CacheCompression).  
  

### Home Cooked Android App ![](https://img.shields.io/badge/-Personal-informational) ![](https://img.shields.io/badge/status-Abandoned-red)

I love food, in fact, I love it way too much. This was one of my personal projects, the idea was to build an Android and iOS apps similar in essence to Uber Eats, but on a personal level. In other words, people who like cooking or want to cook professionally can do so and sell their food on the app (like restaurant on Uber Eats), and people like me who just want food can order through the app just like we do today with Uber Eats. The app had gone through a lot of development and was close to completion, when unfortunately I found out that it would be illegal in the US and Canada, thus bringing it to a halt.
The app utilized google authentication for login/signup, and google firebase database and firebase storage as its database for users, dishes, orders, images, etc. It was only lacking a payment option.  
![](assets/images/app1.png)
![](assets/images/app2.png)
![](assets/images/app3.png)  
  

### Using STT-RAM as main memory ![](https://img.shields.io/badge/-American%20University%20of%20Cairo-ff69b4) ![](https://img.shields.io/badge/status-Finished-green)

This research project was done when I was working at the AUC. The project targeted using Spin Transfer Torque magnetic memories as main memories. Which required modifying the Linux kernel virtual memory. During this project I did the following:
* Analyzed data similarities in memory page dumps of multiple benchmarks.
* Experimented with multiple hashing techniques to be able to identify similar pages.
* Used Gem5 and NVMain simulators to create a full computing system with STT-RAM as main memory.
* [Modified the Linux kernel virtual memory system](https://github.com/mewais/NVMLinux), to allow swapping in pages to similar blocks with less overhead.  

This work was finished successfully and resulted in a conference paper.  
  

### Hardware Trojan Detection ![](https://img.shields.io/badge/-Alexandria%20University-9cf) ![](https://img.shields.io/badge/status-Finished-green)

This was a research project done while I was doing my BSc. It aimed at detecting Trojans inserted into third party IP cores. During this project I was able to:
* Build and test a hardware trojan aimed at an encryption accelerator. With a very small footprint and hard to detect trigger condition.
* Design and implement a technique that uses circuit redundancy along with ahead of time execution to detect hardware Trojans and their attacks.  

This work was finished successfully and resulted in a conference paper.  
  

### ASIC implementation of a TMS320C25 DSP ![](https://img.shields.io/badge/-Alexandria%20University-9cf) ![](https://img.shields.io/badge/status-Finished-green)

This project was sponsored by [Si-Ware Systems](https://www.si-ware.com/) and was my undergraduate graduation project (Thesis). I had achieved the following:
* VHDL Implementation and verification of various building blocks of the TMS320C25 chip.
* FPGA Testing of the TMS320C25 chip on a Xilinx FPGA.
* Full ASIC Synthesis, Timing Analysis, and Post Synthesis Verification of the TMS320C25 using Synopsys Design Compiler, Prime Time, and Modelsim.  

The chip reached fabrication stage.  
